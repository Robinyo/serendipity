package org.serendipity.party.database.seed.au;

import lombok.extern.slf4j.Slf4j;
import org.serendipity.party.entity.*;
import org.serendipity.party.repository.*;
import org.serendipity.party.type.PartyType;
import org.serendipity.party.type.au.IdentifierLifecycleStatus;
import org.serendipity.party.type.au.IdentifierType;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.core.Ordered;
import org.springframework.core.annotation.Order;
import org.springframework.core.io.ClassPathResource;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.time.LocalDateTime;
import java.util.HashSet;

@Component
@Slf4j
@Order(Ordered.LOWEST_PRECEDENCE)
public class HouseOfRepresentatives implements CommandLineRunner {

  static final String PATH = "sample-data/house-of-representatives.csv";

  // The first row in a CSV file contains the names or labels for each column of data

  static final int HONORIFIC = 0;
  static final int SALUTATION = 1;
  static final int POST_NOMINALS = 2;
  static final int SURNAME = 3;
  static final int FIRST_NAME = 4;
  static final int OTHER_NAME = 5;
  static final int PREFERRED_NAME = 6;
  static final int INITIALS = 7;
  static final int ELECTORATE = 8;
  // static final int STATE = 9;
  static final int POLITICAL_PARTY = 10;
  static final int SEX = 11;
  static final int NUMBER_OF_REQUIRED_COLUMNS = SEX + 1;

  @Autowired
  private AddressRepository addressRepository;

  @Autowired
  private IdentifierRepository identifierRepository;

  @Autowired
  private IndividualRepository individualRepository;

  @Autowired
  private OrganisationRepository organisationRepository;

  @Autowired
  private RoleRepository roleRepository;

  @Override
  @Transactional
  public void run(String... args) throws Exception {

    log.info("Loading members of the House of Representatives ...");

    BufferedReader buffer = null;

    try {

      LocalDateTime currentDateTime = LocalDateTime.now();

      //
      // Example Identifier
      //

      Identifier identifier = Identifier.builder()
        .type(IdentifierType.ABN.getCode())
        .value("85 087 326 690")
        .register(IdentifierType.ABN.getRegister())
        .lifecycleStatus(IdentifierLifecycleStatus.ACTIVE.toString())
        .fromDate(currentDateTime)
        .build();

      identifierRepository.save(identifier);

      //
      // Parliament House Address
      //

      Pageable pageable = PageRequest.of(0, 1);

      Page<Address> addresses = addressRepository.findByName("The Senate", pageable);
      Address parliamentHouse = addresses.getContent().getFirst();

      //
      // Process sample data file
      //

      InputStream resource = new ClassPathResource(PATH).getInputStream();

      buffer = new BufferedReader(new InputStreamReader(resource));

      String line = buffer.readLine();

      // log.info("Header: {}", line);

      while ((line = buffer.readLine()) != null && !line.isEmpty()) {

        // Note: No support for strings with embedded commas, for example: "Commonwealth Parliament Offices, Suite 8"
        String[] fields = line.split(",");

        // log.info("row: {}", line);
        // log.info("fields.length: {}", fields.length);

        if (fields.length < NUMBER_OF_REQUIRED_COLUMNS) {
          continue;
        }

        Name name = Name.builder()
          .title(fields[HONORIFIC])
          .givenName(fields[FIRST_NAME])
          .middleName(fields[OTHER_NAME])
          .familyName(fields[SURNAME])
          .honorific(fields[POST_NOMINALS])
          .salutation(fields[SALUTATION])
          .preferredName(fields[PREFERRED_NAME])
          .initials(fields[INITIALS])
          .build();

        // String displayName = name.getFamilyName() + ", " + name.getTitle() + " " + name.getGivenName();

        String displayName = name.getTitle();

        if (name.getTitle().isEmpty()) {
          displayName += name.getGivenName();
        } else {
          displayName += " " + name.getGivenName();
        }

        if (name.getGivenName().isEmpty()) {
          displayName += name.getFamilyName();
        } else {
          displayName += " " + name.getFamilyName();
        }

        Party individualParty = Party.builder()
          .type(PartyType.INDIVIDUAL)
          .displayName(displayName)
          .addresses(new HashSet<Address>())
          .roles(new HashSet<Role>())
          .build();

        String email = name.getGivenName().toLowerCase() + "." + name.getFamilyName().toLowerCase() + "@aph.gov.au";

        Individual individual = Individual.builder()
          .party(individualParty)
          .name(name)
          .sex(fields[SEX])
          .email(email)
          .phoneNumber("")
          .photoUrl("")
          .electorate(fields[ELECTORATE])
          .build();

        individualRepository.save(individual);

        Role member = Role.builder()
          .partyId(individual.getParty().getId())
          .partyType(individual.getParty().getType())
          .partyName(individual.getParty().getDisplayName())
          .partyEmail(individual.getEmail())
          .partyPhoneNumber(individual.getPhoneNumber())
          .role("Member")
          .relationship("Membership")
          .reciprocalRole("Political Party")
          .build();

        Role contact = Role.builder()
          .partyId(individual.getParty().getId())
          .partyType(individual.getParty().getType())
          .partyName(individual.getParty().getDisplayName())
          .partyEmail(individual.getEmail())
          .partyPhoneNumber(individual.getPhoneNumber())
          .role("Contact")
          .relationship("Association")
          .reciprocalRole("Account")
          .build();

        boolean membership = true;

        String abbreviation = fields[POLITICAL_PARTY].toUpperCase();

        PoliticalParty politicalParty = PoliticalParty.valueOfAbbreviation(abbreviation);

        switch (politicalParty) {

          case AUSTRALIAN_GREENS:
          case AUSTRALIAN_LABOR_PARTY:
          case LIBERAL_NATIONAL_PARTY_OF_QUEENSLAND:
          case LIBERAL_PARTY:
          case LIBERAL_PARTY_OF_AUSTRALIA:
          case NATIONAL_PARTY_OF_AUSTRALIA:
          case PAULINE_HANSONS_ONE_NATION:

            // log.info("Political Party: {}", politicalParty.toString());

            Page<Organisation> organisations = organisationRepository.findByName(politicalParty.toString(), pageable);

            Organisation organisation = organisations.getContent().getFirst();

            member.setReciprocalPartyId(organisation.getParty().getId());
            member.setReciprocalPartyType(organisation.getParty().getType());
            member.setReciprocalPartyName(organisation.getParty().getDisplayName());
            member.setReciprocalPartyEmail(organisation.getEmail());
            member.setReciprocalPartyPhoneNumber(organisation.getPhoneNumber());

            contact.setReciprocalPartyId(organisation.getParty().getId());
            contact.setReciprocalPartyType(organisation.getParty().getType());
            contact.setReciprocalPartyName(organisation.getParty().getDisplayName());
            contact.setReciprocalPartyEmail(organisation.getEmail());
            contact.setReciprocalPartyPhoneNumber(organisation.getPhoneNumber());

            break;

          case INDEPENDENT:
          default:

            if (!abbreviation.equals("IND")) {
              log.info("Political Party: {}", abbreviation);
            }

            membership = false;

            break;
        }

        individualParty.getAddresses().add(parliamentHouse);

        if (membership) {
          roleRepository.save(member);
          roleRepository.save(contact);
          individualParty.getRoles().add(member);
          individualParty.getRoles().add(contact);
        }

        individualRepository.save(individual);

      }

      log.info("Loading members of the House of Representatives complete");

    } catch (IOException | NullPointerException e) {

      log.error("{}", e.getLocalizedMessage());

    } finally {

      if (buffer != null) {
        buffer.close();
      }

    }

  }

}

// Timestamp currentTime = new Timestamp(System.currentTimeMillis());

/*

      try {

        ObjectMapper mapper = new ObjectMapper();

        mapper.setSerializationInclusion(JsonInclude.Include.NON_NULL);
        mapper.setSerializationInclusion(JsonInclude.Include.NON_EMPTY);

        mapper.enable(SerializationFeature.INDENT_OUTPUT);

        log.info("identifier:  {}", "\n" + mapper.writeValueAsString(identifier));

      } catch (JsonProcessingException jpe) {

        log.error("House of Representatives - JSON Processing Exception");
      }

*/
