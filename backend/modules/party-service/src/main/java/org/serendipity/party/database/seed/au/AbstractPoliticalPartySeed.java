package org.serendipity.party.database.seed.au;

import lombok.Builder;
import lombok.Value;
import lombok.extern.slf4j.Slf4j;
import org.jspecify.annotations.NonNull;
import org.serendipity.party.entity.*;
import org.serendipity.party.service.AddressService;
import org.serendipity.party.service.IndividualService;
import org.serendipity.party.service.OrganisationService;
import org.serendipity.party.service.RoleService;
import org.serendipity.party.type.LocationType;
import org.serendipity.party.type.PartyType;
import org.serendipity.party.type.au.LegalEntityType;
import org.serendipity.party.type.au.Sex;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.Objects;
import java.util.stream.Collectors;
import java.util.stream.Stream;

@Slf4j
public abstract class AbstractPoliticalPartySeed implements CommandLineRunner {

  @Autowired
  protected AddressService addressService;

  @Autowired
  protected IndividualService individualService;

  @Autowired
  protected OrganisationService organisationService;

  @Autowired
  protected RoleService roleService;

  /**
   * Subclasses define the party-specific seed data.
   */
  protected abstract PoliticalPartyData getPartyData();

  @Override
  @Transactional
  public void run(String @NonNull ... args) throws Exception {

    PoliticalPartyData data = getPartyData();
    String partyName = data.getPoliticalParty().toString();

    log.info("Create {} ...", partyName);

    try {
      LocalDateTime now = LocalDateTime.now();

      // 1. Head Office Address
      Location location = Location.builder()
        .type(LocationType.ADDRESS)
        .displayName(data.getHeadOfficeDisplayName())
        .fromDate(now)
        .build();

      Address headOffice = Address.builder()
        .location(location)
        .name("")
        .line1(data.getAddressLine1())
        .line2(data.getAddressLine2())
        .city(data.getCity())
        .state(data.getState())
        .postalCode(data.getPostalCode())
        .country(data.getCountry())
        .addressType("Principal Place of Business")
        .build();

      headOffice = addressService.save(headOffice);

      // 2. Primary Contact (Individual)
      Name name = data.getPrimaryContactName();
      String displayName = buildDisplayName(name);

      Party individualParty = Party.builder()
        .type(PartyType.INDIVIDUAL)
        .displayName(displayName)
        .addresses(new HashSet<>())
        .roles(new HashSet<>())
        .build();

      Individual individual = Individual.builder()
        .party(individualParty)
        .name(name)
        .sex(data.getSex().toString())
        .email(data.getIndividualEmail())
        .phoneNumber(data.getPhoneNumber())
        .faxNumber(data.getFaxNumber())
        .preferredContactMethod(data.getPreferredContactMethod())
        .build();

      individual = individualService.save(individual);

      // 3. Organisation
      Party organisationParty = Party.builder()
        .type(PartyType.ORGANISATION)
        .legalEntityType(LegalEntityType.OTHER_INCORPORATED_ENTITY.toString())
        .displayName(partyName)
        .addresses(new HashSet<>())
        .roles(new HashSet<>())
        .build();

      Organisation organisation = Organisation.builder()
        .party(organisationParty)
        .name(partyName)
        .email(data.getOrganisationEmail())
        .phoneNumber(data.getPhoneNumber())
        .faxNumber(data.getFaxNumber())
        .preferredContactMethod(data.getPreferredContactMethod())
        .establishmentDate(now)
        .build();

      organisation = organisationService.save(organisation);

      // 4. Roles & Relationships
      Role politicalPartyRole = Role.builder()
        .partyPublicId(organisation.getParty().getPublicId())
        .partyType(organisation.getParty().getType())
        .partyName(organisation.getParty().getDisplayName())
        .partyEmail(organisation.getEmail())
        .partyPhoneNumber(organisation.getPhoneNumber())
        .role("Political Party")
        .relationship("Office Holder")
        .reciprocalRole("Primary Contact")
        .reciprocalPartyPublicId(individual.getParty().getPublicId())
        .reciprocalPartyType(individual.getParty().getType())
        .reciprocalPartyName(individual.getParty().getDisplayName())
        .reciprocalPartyEmail(individual.getEmail())
        .reciprocalPartyPhoneNumber(individual.getPhoneNumber())
        .build();

      roleService.save(politicalPartyRole);

      Role memberRole = Role.builder()
        .partyPublicId(individual.getParty().getPublicId())
        .partyType(individual.getParty().getType())
        .partyName(individual.getParty().getDisplayName())
        .partyEmail(individual.getEmail())
        .partyPhoneNumber(individual.getPhoneNumber())
        .role("Member")
        .relationship("Membership")
        .reciprocalRole("Political Party")
        .reciprocalPartyPublicId(organisation.getParty().getPublicId())
        .reciprocalPartyType(organisation.getParty().getType())
        .reciprocalPartyName(organisation.getParty().getDisplayName())
        .reciprocalPartyEmail(organisation.getEmail())
        .reciprocalPartyPhoneNumber(organisation.getPhoneNumber())
        .build();

      roleService.save(memberRole);

      // 5. Link Shared Address and Roles
      organisationParty.getAddresses().add(headOffice);
      organisationParty.getRoles().add(politicalPartyRole);
      organisationService.save(organisation);

      individualParty.getAddresses().add(headOffice);
      individualParty.getRoles().add(memberRole);
      individualService.save(individual);

      log.info("Create {} complete", partyName);

    } catch (Exception e) {
      log.error("Failed to seed {}: {}", partyName, e.getMessage(), e);
      throw e;
    }
  }

  private String buildDisplayName(Name name) {
    return Stream.of(name.getTitle(), name.getGivenName(), name.getFamilyName())
      .filter(Objects::nonNull)
      .filter(s -> !s.trim().isEmpty())
      .collect(Collectors.joining(" "));
  }

  @Value
  @Builder
  public static class PoliticalPartyData {
    Object politicalParty;
    String headOfficeDisplayName;
    String addressLine1;
    @Builder.Default
    String addressLine2 = "";
    String city;
    String state;
    String postalCode;
    @Builder.Default
    String country = "Australia";
    Name primaryContactName;
    Sex sex;
    String individualEmail;
    String organisationEmail;
    String phoneNumber;
    @Builder.Default
    String faxNumber = "";
    @Builder.Default
    String preferredContactMethod = "";
  }
}