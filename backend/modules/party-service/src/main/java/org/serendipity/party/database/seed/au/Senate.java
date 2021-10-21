package org.serendipity.party.database.seed.au;

import lombok.extern.slf4j.Slf4j;
import org.serendipity.party.entity.*;
import org.serendipity.party.repository.AddressRepository;
import org.serendipity.party.repository.IndividualRepository;
import org.serendipity.party.repository.OrganisationRepository;
import org.serendipity.party.repository.RoleRepository;
import org.serendipity.party.type.PartyType;
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
import java.util.HashSet;

@Component
@Slf4j
@Order(Ordered.LOWEST_PRECEDENCE)
public class Senate implements CommandLineRunner {

  // A senator is a member of the Australian Senate, elected to represent a state or territory. There are 76 senators,
  // 12 from each state and two each from the Australian Capital Territory and the Northern Territory.

  static final String PATH = "sample-data/senate.csv";

  static final int TITLE = 0;
  static final int SALUTATION = 1;
  static final int SURNAME = 2;
  static final int FIRST_NAME = 3;
  static final int OTHER_NAME = 4;
  static final int PREFERRED_NAME = 5;
  static final int INITIALS = 6;
  static final int POST_NOMINALS = 7;
  static final int POLITICAL_PARTY = 9;
  static final int SEX = 10;

  @Autowired
  private AddressRepository addressRepository;

  @Autowired
  private IndividualRepository individualRepository;

  @Autowired
  private OrganisationRepository organisationRepository;

  @Autowired
  private RoleRepository roleRepository;

  @Override
  @Transactional
  public void run(String... args) throws Exception {

    log.info("Loading members of the Senate ...");

    BufferedReader buffer = null;

    try {

      // Timestamp currentTime = new Timestamp(System.currentTimeMillis());

      //
      // Parliament House Address
      //

      Pageable pageable = PageRequest.of(0, 1);

      Page<Address> addresses = addressRepository.findByName("The Senate", pageable);

      Address parliamentHouse = addresses.getContent().get(0);

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

        Name name = Name.builder()
          .title(fields[TITLE])
          .givenName(fields[FIRST_NAME])
          .middleName(fields[OTHER_NAME])
          .familyName(fields[SURNAME])
          .honorific(fields[POST_NOMINALS])
          .salutation(fields[SALUTATION])
          .preferredName(fields[PREFERRED_NAME])
          .initials(fields[INITIALS])
          .build();

        String displayName = name.getFamilyName() + ", " + name.getTitle() + " " + name.getGivenName();

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
          .build();

        individualRepository.save(individual);

        Role role = Role.builder()
          .role("Member")
          .partyId(individual.getParty().getId())
          .partyType(individual.getParty().getType())
          .partyName(individual.getParty().getDisplayName())
          .partyEmail(individual.getEmail())
          .partyPhoneNumber(individual.getPhoneNumber())
          .relationship("Membership")
          .reciprocalRole("Organisation")
          // .reciprocalPartyId(1L)
          // .reciprocalPartyType(PartyType.ORGANISATION)
          // .reciprocalPartyName("")
          // .reciprocalPartyEmail("")
          // .reciprocalPartyPhoneNumber("")
          .build();

        boolean membership = true;

        // "AG" | "ALP" | "CA" | "JLN" | "LP" | "NATS" | "PHON" | "IND
        String abbreviation = fields[POLITICAL_PARTY].toUpperCase();

        PoliticalParty politicalParty = PoliticalParty.valueOfAbbreviation(abbreviation);

        switch (politicalParty) {

          case AUSTRALIAN_GREENS:
          case AUSTRALIAN_LABOR_PARTY:
          case CENTRE_ALLIANCE:
          case JACQUI_LAMBIE_NETWORK:
          case LIBERAL_PARTY_OF_AUSTRALIA:
          case NATIONAL_PARTY_OF_AUSTRALIA:
          case PAULINE_HANSONS_ONE_NATION:

            // log.info("Political Party: {}", politicalParty.toString());

            Page<Organisation> organisations = organisationRepository.findByName(politicalParty.toString(), pageable);

            Organisation organisation = organisations.getContent().get(0);

            role.setReciprocalPartyId(organisation.getParty().getId());
            role.setReciprocalPartyType(organisation.getParty().getType());
            role.setReciprocalPartyName(organisation.getParty().getDisplayName());
            role.setReciprocalPartyEmail(organisation.getEmail());
            role.setReciprocalPartyPhoneNumber(organisation.getPhoneNumber());

            break;

          case INDEPENDENT:
          default:

            log.info("Political Party: {}", abbreviation);

            membership = false;

            break;
        }

        individualParty.getAddresses().add(parliamentHouse);

        if (membership) {
          roleRepository.save(role);
          individualParty.getRoles().add(role);
        }

        individualRepository.save(individual);

      }

      log.info("Loading members of the Senate complete");

    } catch (IOException | NullPointerException e) {

      log.error("{}", e.getLocalizedMessage());

    } finally {

      if (buffer != null) {
        buffer.close();
      }

    }

  }

}

// https://www.aph.gov.au/Senators_and_Members
// https://www.aph.gov.au/Senators_and_Members/Guidelines_for_Contacting_Senators_and_Members/Address_labels_and_CSV_files

// https://stackoverflow.com/questions/10387329/using-string-representations-of-enum-values-in-switch-case
// https://www.baeldung.com/java-enum-values

// static final int STATE = 8;
// static final int ELECTORATE_TELEPHONE = 16;

// Set<Address> addresses = new HashSet<Address>();
// addresses.add(parliamentHouse);

/*

import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.SerializationFeature;

            try {

              ObjectMapper mapper = new ObjectMapper();

              mapper.setSerializationInclusion(JsonInclude.Include.NON_NULL);
              mapper.setSerializationInclusion(JsonInclude.Include.NON_EMPTY);

              mapper.enable(SerializationFeature.INDENT_OUTPUT);

              log.info("{}", "\n" + mapper.writeValueAsString(organisation));

            } catch (JsonProcessingException jpe) {

              log.error("Senators - JSON Processing Exception");
            }

*/

/*

import java.text.SimpleDateFormat;
import java.util.Date;

Date dateOfBirth = new SimpleDateFormat("dd/MM/yyyy").parse("01/11/1982");
.dateOfBirth(dateOfBirth)

*/

/*

    // Auditable auditable = new Auditable();

    Location location = new Location();
    location.setType("Address");
    location.setFromDate(timestamp);
    location.setDisplayName("PO Box 6100 Parliament House Canberra ACT 2600");

*/
