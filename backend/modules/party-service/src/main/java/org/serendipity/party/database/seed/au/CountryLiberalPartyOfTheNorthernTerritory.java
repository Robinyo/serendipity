package org.serendipity.party.database.seed.au;

import org.serendipity.party.entity.Name;
import org.serendipity.party.type.au.Sex;
import org.springframework.core.annotation.Order;
import org.springframework.stereotype.Component;

@Component
@Order(2)
public class CountryLiberalPartyOfTheNorthernTerritory extends AbstractPoliticalPartySeed {

  @Override
  protected PoliticalPartyData getPartyData() {
    return PoliticalPartyData.builder()
      .politicalParty(PoliticalParty.COUNTRY_LIBERAL_PARTY)
      .headOfficeDisplayName("Level 1, 28 Cavenagh Street Darwin NT 0800")
      .addressLine1("Level 1, 28 Cavenagh Street")
      .city("Darwin")
      .state("NT")
      .postalCode("0800")
      .primaryContactName(Name.builder()
        .title("Mr")
        .givenName("Mike")
        .familyName("Gunner")
        .build())
      .sex(Sex.MALE)
      .individualEmail("mike.gunner@clp.nt.au")
      .organisationEmail("contact@clp.nt.au")
      .phoneNumber("(08) 8981 4800")
      .build();
  }

}
