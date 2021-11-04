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

import java.sql.Timestamp;
import java.util.HashSet;

@Component
@Slf4j
@Order(2)
public class PaulineHansonsOneNation implements CommandLineRunner {

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

    log.info("Create {} ...", PoliticalParty.PAULINE_HANSONS_ONE_NATION.toString());

    try {

      //
      // Head Office Address
      //

      Timestamp currentTime = new Timestamp(System.currentTimeMillis());

      Location location = Location.builder()
        .type(LocationType.ADDRESS)
        .displayName("PO Box 136 Pinkenba QLD 4008")
        .fromDate(currentTime)
        .build();

      Address headOffice = Address.builder()
        .location(location)
        .name("")
        .line1("PO Box 136")
        .line2("")
        .city("Pinkenba")
        .state("QLD")
        .postalCode("4008")
        .country("Australia")
        .addressType("Principle Place of Business")
        .build();

      addressRepository.save(headOffice);

      // Create the Primary Contact (Individual)

      Name name = Name.builder()
        .givenName("Rod")
        .familyName("Miles")
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
        .email("rod.mills@onenation.org.au")
        .phoneNumber("1300 857 466")
        .build();

      // Save the Primary Contact (Individual)

      individualRepository.save(individual);

      // Organisation

      Party organisationParty = Party.builder()
        .type(PartyType.ORGANISATION)
        .legalType(LegalType.OTHER_INCORPORATED_ENTITY.toString())
        .displayName(PoliticalParty.PAULINE_HANSONS_ONE_NATION.toString())
        .addresses(new HashSet<Address>())
        .roles(new HashSet<Role>())
        .build();

      Organisation organisation = Organisation.builder()
        .party(organisationParty)
        .name(PoliticalParty.PAULINE_HANSONS_ONE_NATION.toString())
        .email("hey@onenation.org.au")
        .phoneNumber("1300 857 466")
        .build();

      organisationRepository.save(organisation);

      // | Party             | Role            | Relationship   | Role            | Party             |
      // | ----------------- | --------------- | -------------- | --------------- | ----------------- |
      // | Australian Greens | Political Party | Office Holder  | Primary Contact | Jordan Hull       |
      // | Jordan Hull       | Member          | Membership     | Political Party | Australian Greens |
      // | Jordan Hull       | Public Officer  | Office Holder  | Political Party | Australian Greens |

      Role organisationRole = Role.builder()
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

      roleRepository.save(organisationRole);

      organisationParty.getAddresses().add(headOffice);
      organisationParty.getRoles().add(organisationRole);

      organisationRepository.save(organisation);

      Role individualRole = Role.builder()
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

      roleRepository.save(individualRole);

      individualParty.getAddresses().add(headOffice);
      individualParty.getRoles().add(individualRole);

      individualRepository.save(individual);

      log.info("Create {} complete", PoliticalParty.PAULINE_HANSONS_ONE_NATION.toString());

    } catch (Exception e) {

      log.error("{}", e.getLocalizedMessage());
    }

  }

}
