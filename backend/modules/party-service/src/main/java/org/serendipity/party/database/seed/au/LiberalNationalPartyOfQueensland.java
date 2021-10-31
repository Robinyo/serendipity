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
public class LiberalNationalPartyOfQueensland implements CommandLineRunner {


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

    log.info("Create {} ...", PoliticalParty.LIBERAL_NATIONAL_PARTY_OF_QUEENSLAND.toString());

    try {

      //
      // Head Office Address
      //

      // Timestamp currentTime = new Timestamp(System.currentTimeMillis());

      Location location = Location.builder()
        .type(LocationType.ADDRESS)
        .displayName("281 Sandgate Road Albion QLD 4010")
        // .fromDate(currentTime)
        .build();

      Address headOffice = Address.builder()
        .location(location)
        .name("")
        .line1("281 Sandgate Road")
        .line2("")
        .city("Albion")
        .state("QLD")
        .postalCode("4010")
        .country("Australia")
        .addressType("Principle Place of Business")
        .build();

      addressRepository.save(headOffice);

      // Create the Primary Contact (Individual)

      Name name = Name.builder()
        .givenName("David")
        .familyName("Hutchinson")
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
        .email("david.hutchinson@lnp.org.au")
        .phoneNumber("(07) 3844 0666")
        .build();

      // Save the Primary Contact (Individual)

      individualRepository.save(individual);

      // Organisation

      Party organisationParty = Party.builder()
        .type(PartyType.ORGANISATION)
        .legalType(LegalType.OTHER_INCORPORATED_ENTITY.toString())
        .displayName(PoliticalParty.AUSTRALIAN_GREENS.toString())
        .addresses(new HashSet<Address>())
        .roles(new HashSet<Role>())
        .build();

      Organisation organisation = Organisation.builder()
        .party(organisationParty)
        .name(PoliticalParty.LIBERAL_NATIONAL_PARTY_OF_QUEENSLAND.toString())
        .email("greens@greens.org.au")
        .phoneNumber("(02) 6140 3220")
        .build();

      organisationRepository.save(organisation);

      // | Party             | Role         | Relationship  | Role            | Party             |
      // | ----------------- | ------------ | --------------| --------------- | ----------------- |
      // | Australian Greens | Organisation | Office Bearer | Primary Contact | Jordan Hull       |
      // | Jordan Hull       | Member       | Membership    | Organisation    | Australian Greens |

      Role role = Role.builder()
        .partyId(organisation.getParty().getId())
        .partyType(organisation.getParty().getType())
        .partyName(organisation.getParty().getDisplayName())
        .partyEmail(organisation.getEmail())
        .partyPhoneNumber(organisation.getPhoneNumber())
        .role("Organisation")
        .relationship("Office Bearer")
        .reciprocalRole("Primary Contact")
        .reciprocalPartyId(individual.getParty().getId())
        .reciprocalPartyType(individual.getParty().getType())
        .reciprocalPartyName(individual.getParty().getDisplayName())
        .reciprocalPartyEmail(individual.getEmail())
        .reciprocalPartyPhoneNumber(individual.getPhoneNumber())
        .build();

      roleRepository.save(role);

      organisationParty.getAddresses().add(headOffice);
      organisationParty.getRoles().add(role);

      organisationRepository.save(organisation);

      Role reciprocalRole = Role.builder()
        .partyId(individual.getParty().getId())
        .partyType(individual.getParty().getType())
        .partyName(individual.getParty().getDisplayName())
        .partyEmail(individual.getEmail())
        .partyPhoneNumber(individual.getPhoneNumber())
        .role("Member")
        .relationship("Membership")
        .reciprocalRole("Organisation")
        .reciprocalPartyId(organisation.getParty().getId())
        .reciprocalPartyType(organisation.getParty().getType())
        .reciprocalPartyName(organisation.getParty().getDisplayName())
        .reciprocalPartyEmail(organisation.getEmail())
        .reciprocalPartyPhoneNumber(organisation.getPhoneNumber())
        .build();

      roleRepository.save(reciprocalRole);

      individualParty.getAddresses().add(headOffice);
      individualParty.getRoles().add(reciprocalRole);

      individualRepository.save(individual);

      log.info("Create {} complete", PoliticalParty.LIBERAL_NATIONAL_PARTY_OF_QUEENSLAND.toString());

    } catch (Exception e) {

      log.error("{}", e.getLocalizedMessage());
    }

  }

}
