package org.serendipity.party.database.seed.au;

import org.serendipity.party.entity.Name;
import org.serendipity.party.type.au.Sex;
import org.springframework.core.annotation.Order;
import org.springframework.stereotype.Component;

@Component
@Order(2)
public class UnitedAustraliaParty extends AbstractPoliticalPartySeed {

  @Override
  protected PoliticalPartyData getPartyData() {
    return PoliticalPartyData.builder()
      .politicalParty(PoliticalParty.UNITED_AUSTRALIA_PARTY)
      .headOfficeDisplayName("Level 38, 1 Martin Place Sydney NSW 2000")
      .addressLine1("Level 38, 1 Martin Place")
      .city("Sydney")
      .state("NSW")
      .postalCode("2000")
      .primaryContactName(Name.builder()
        .title("Mr")
        .givenName("Clive")
        .familyName("Palmer")
        .build())
      .sex(Sex.MALE)
      .individualEmail("clive.palmer@uap.com.au")
      .organisationEmail("contact@uap.com.au")
      .phoneNumber("(02) 9221 5555")
      .build();
  }

}
