package org.serendipity.party.database.seed.au;

import org.serendipity.party.entity.Name;
import org.serendipity.party.type.au.Sex;
import org.springframework.core.annotation.Order;
import org.springframework.stereotype.Component;

@Component
@Order(2)
public class NationalPartyOfAustralia extends AbstractPoliticalPartySeed {

  @Override
  protected PoliticalPartyData getPartyData() {
    return PoliticalPartyData.builder()
      .politicalParty(PoliticalParty.NATIONAL_PARTY_OF_AUSTRALIA)
      .headOfficeDisplayName("1/6 Geils Court Deakin ACT 2600")
      .addressLine1("1/6 Geils Court")
      .city("Deakin")
      .state("ACT")
      .postalCode("2600")
      .primaryContactName(Name.builder()
        .title("Ms")
        .givenName("Kay")
        .familyName("Hull")
        .build())
      .sex(Sex.FEMALE)
      .individualEmail("kay.hull@nationals.org.au")
      .organisationEmail("federal.nationals@nationals.org.au")
      .phoneNumber("(02) 6273 3822")
      .build();
  }

}