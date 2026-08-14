package org.serendipity.party.database.seed.au;

import lombok.extern.slf4j.Slf4j;
import org.jspecify.annotations.NonNull;
import org.serendipity.party.entity.*;
import org.serendipity.party.service.*;
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
import java.io.InputStream;
import java.io.InputStreamReader;
import java.util.HashSet;
import java.util.Objects;
import java.util.stream.Collectors;
import java.util.stream.Stream;

@Component
@Slf4j
@Order(Ordered.LOWEST_PRECEDENCE)
public class Senate implements CommandLineRunner {

  static final String PATH = "sample-data/senate.csv";

  static final int TITLE = 0;
  static final int SALUTATION = 1;
  static final int SURNAME = 2;
  static final int FIRST_NAME = 3;
  static final int OTHER_NAME = 4;
  static final int PREFERRED_NAME = 5;
  static final int INITIALS = 6;
  static final int POST_NOMINALS = 7;
  // static final int STATE = 8;
  static final int POLITICAL_PARTY = 9;
  static final int SEX = 10;
  static final int NUMBER_OF_REQUIRED_COLUMNS = SEX + 1;

  @Autowired
  private AddressService addressService;

  @Autowired
  private IndividualService individualService;

  @Autowired
  private OrganisationService organisationService;

  @Autowired
  private RoleService roleService;

  @Override
  @Transactional
  public void run(String @NonNull ... args) throws Exception {

    log.info("Loading members of the Senate ...");

    try {
      // Look up Parliament House Address
      Pageable pageable = PageRequest.of(0, 1);
      Page<Address> addresses = addressService.findByName("The Senate", pageable);
      Address parliamentHouse = addresses.getContent().getFirst();

      // Process CSV sample data
      try (InputStream resource = new ClassPathResource(PATH).getInputStream();
           BufferedReader buffer = new BufferedReader(new InputStreamReader(resource))) {

        String line = buffer.readLine(); // Header line

        while ((line = buffer.readLine()) != null && !line.trim().isEmpty()) {

          String[] fields = line.split(",");

          if (fields.length < NUMBER_OF_REQUIRED_COLUMNS) {
            continue;
          }

          Name name = Name.builder()
            .title(fields[TITLE])
            .givenName(fields[FIRST_NAME])
            .preferredName(fields[PREFERRED_NAME])
            .middleName(fields[OTHER_NAME])
            .familyName(fields[SURNAME])
            .honorific(fields[POST_NOMINALS])
            .salutation(fields[SALUTATION])
            .initials(fields[INITIALS])
            .build();

          String displayName = Stream.of(name.getTitle(), name.getGivenName(), name.getFamilyName())
            .filter(Objects::nonNull)
            .filter(s -> !s.trim().isEmpty())
            .collect(Collectors.joining(" "));

          Party individualParty = Party.builder()
            .type(PartyType.INDIVIDUAL)
            .displayName(displayName)
            .addresses(new HashSet<>())
            .roles(new HashSet<>())
            .build();

          String email = String.format("%s.%s@aph.gov.au",
            name.getGivenName().toLowerCase(),
            name.getFamilyName().toLowerCase());

          Individual individual = Individual.builder()
            .party(individualParty)
            .name(name)
            .sex(fields[SEX])
            .email(email)
            .phoneNumber("")
            .photoUrl("")
            .build();

          individual = individualService.save(individual);

          Role member = Role.builder()
            .partyPublicId(individual.getParty().getPublicId())
            .partyType(individual.getParty().getType())
            .partyName(individual.getParty().getDisplayName())
            .partyEmail(individual.getEmail())
            .partyPhoneNumber(individual.getPhoneNumber())
            .role("Member")
            .relationship("Membership")
            .reciprocalRole("Political Party")
            .build();

          Role contact = Role.builder()
            .partyPublicId(individual.getParty().getPublicId())
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

              Page<Organisation> organisations = organisationService.findByName(politicalParty.toString(), pageable);
              Organisation organisation = organisations.getContent().getFirst();

              member.setReciprocalPartyPublicId(organisation.getParty().getPublicId());
              member.setReciprocalPartyType(organisation.getParty().getType());
              member.setReciprocalPartyName(organisation.getParty().getDisplayName());
              member.setReciprocalPartyEmail(organisation.getEmail());
              member.setReciprocalPartyPhoneNumber(organisation.getPhoneNumber());

              contact.setReciprocalPartyPublicId(organisation.getParty().getPublicId());
              contact.setReciprocalPartyType(organisation.getParty().getType());
              contact.setReciprocalPartyName(organisation.getParty().getDisplayName());
              contact.setReciprocalPartyEmail(organisation.getEmail());
              contact.setReciprocalPartyPhoneNumber(organisation.getPhoneNumber());

              break;

            case INDEPENDENT:
            default:
              if (!abbreviation.equals("IND")) {
                log.info("Political Party abbreviation: {}", abbreviation);
              }
              membership = false;
              break;
          }

          individualParty.getAddresses().add(parliamentHouse);

          if (membership) {
            roleService.save(member);
            roleService.save(contact);
            individualParty.getRoles().add(member);
            individualParty.getRoles().add(contact);
          }

          individualService.save(individual);
        }
      }

      log.info("Loading members of the Senate complete");

    } catch (Exception e) {
      log.error("Failed to load members of the Senate: {}", e.getLocalizedMessage(), e);
      throw e;
    }
  }

}