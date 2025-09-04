package org.serendipity.party.database.seed.au;

import lombok.extern.slf4j.Slf4j;
import org.serendipity.party.entity.*;
import org.serendipity.party.repository.AddressRepository;
import org.serendipity.party.repository.IndividualRepository;
import org.serendipity.party.repository.OrganisationRepository;
import org.serendipity.party.repository.RoleRepository;
import org.serendipity.party.type.LocationType;
import org.serendipity.party.type.PartyType;
import org.serendipity.party.type.au.LegalType;
import org.serendipity.party.type.au.Sex;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.core.annotation.Order;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.util.HashSet;

@Component
@Slf4j
@Order(2)
public class JacquiLambieNetwork implements CommandLineRunner {

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

    log.info("Create {} ...", PoliticalParty.JACQUI_LAMBIE_NETWORK.toString());

    try {

      //
      // Head Office Address
      //

      // Timestamp currentTime = new Timestamp(System.currentTimeMillis());

      Location location = Location.builder()
        .type(LocationType.ADDRESS)
        .displayName("22 Mount Street Burnie TAS 7320")
        // .fromDate(currentTime)
        .build();

      Address headOffice = Address.builder()
        .location(location)
        .name("")
        .line1("Shop 4")
        .line2("22 Mount Street")
        .city("Burnie")
        .state("TAS")
        .postalCode("7320")
        .country("Australia")
        .addressType("Principle Place of Business")
        .build();

      addressRepository.save(headOffice);

      // Create the Primary Contact (Individual)

      Name name = Name.builder()
        .givenName("Glynn")
        .familyName("Williams")
        .build();

      Party individualParty = Party.builder()
        .type(PartyType.INDIVIDUAL)
        .displayName(name.getFamilyName() + ", " + name.getGivenName())
        .addresses(new HashSet<>())
        .roles(new HashSet<>())
        .build();

      Individual individual = Individual.builder()
        .party(individualParty)
        .name(name)
        .sex(Sex.MALE.toString())
        .email("glynn.williams@lambienetwork.com.au")
        .phoneNumber("(03) 6431 3112")
        .build();

      // Save the Primary Contact (Individual)

      individualRepository.save(individual);

      // Organisation

      Party organisationParty = Party.builder()
        .type(PartyType.ORGANISATION)
        .legalType(LegalType.OTHER_INCORPORATED_ENTITY.toString())
        .displayName(PoliticalParty.JACQUI_LAMBIE_NETWORK.toString())
        .addresses(new HashSet<Address>())
        .roles(new HashSet<Role>())
        .build();

      Organisation organisation = Organisation.builder()
        .party(organisationParty)
        .name(PoliticalParty.JACQUI_LAMBIE_NETWORK.toString())
        .email("hey@lambienetwork.com.au")
        .phoneNumber("(03) 6431 3112")
        .build();

      organisationRepository.save(organisation);

      // | Party             | Role            | Relationship   | Role            | Party             |
      // | ----------------- | --------------- | -------------- | --------------- | ----------------- |
      // | Australian Greens | Political Party | Office Holder  | Primary Contact | Jordan Hull       |
      // | Jordan Hull       | Member          | Membership     | Political Party | Australian Greens |
      // | Jordan Hull       | Public Officer  | Office Holder  | Political Party | Australian Greens |

      Role politicalParty = Role.builder()
        .partyId(organisation.getParty().getId())
        .partyType(organisation.getParty().getType())
        .partyName(organisation.getParty().getDisplayName())
        .partyEmail(organisation.getEmail())
        .partyPhoneNumber(organisation.getPhoneNumber())
        .role("Political Party")
        .relationship("Office Holder")
        .reciprocalRole("Primary Contact")
        .reciprocalPartyId(individual.getParty().getId())
        .reciprocalPartyType(individual.getParty().getType())
        .reciprocalPartyName(individual.getParty().getDisplayName())
        .reciprocalPartyEmail(individual.getEmail())
        .reciprocalPartyPhoneNumber(individual.getPhoneNumber())
        .build();

      roleRepository.save(politicalParty);

      organisationParty.getAddresses().add(headOffice);
      organisationParty.getRoles().add(politicalParty);

      organisationRepository.save(organisation);

      Role member = Role.builder()
        .partyId(individual.getParty().getId())
        .partyType(individual.getParty().getType())
        .partyName(individual.getParty().getDisplayName())
        .partyEmail(individual.getEmail())
        .partyPhoneNumber(individual.getPhoneNumber())
        .role("Member")
        .relationship("Membership")
        .reciprocalRole("Political Party")
        .reciprocalPartyId(organisation.getParty().getId())
        .reciprocalPartyType(organisation.getParty().getType())
        .reciprocalPartyName(organisation.getParty().getDisplayName())
        .reciprocalPartyEmail(organisation.getEmail())
        .reciprocalPartyPhoneNumber(organisation.getPhoneNumber())
        .build();

      roleRepository.save(member);

      individualParty.getAddresses().add(headOffice);
      individualParty.getRoles().add(member);

      individualRepository.save(individual);

      log.info("Create {} complete", PoliticalParty.JACQUI_LAMBIE_NETWORK.toString());

    } catch (Exception e) {

      log.error("{}", e.getLocalizedMessage());
    }

  }

}
