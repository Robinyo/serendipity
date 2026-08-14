package org.serendipity.party.database.seed.au;

import org.serendipity.party.entity.Name;
import org.serendipity.party.type.au.Sex;
import org.springframework.core.annotation.Order;
import org.springframework.stereotype.Component;

@Component
@Order(2)
public class PaulineHansonsOneNation extends AbstractPoliticalPartySeed {

  @Override
  protected PoliticalPartyData getPartyData() {
    return PoliticalPartyData.builder()
      .politicalParty(PoliticalParty.PAULINE_HANSONS_ONE_NATION)
      .headOfficeDisplayName("2/6-12 Boronia Rd Brisbane Airport QLD 4008")
      .addressLine1("2/6-12 Boronia Rd")
      .city("Brisbane Airport")
      .state("QLD")
      .postalCode("4008")
      .primaryContactName(Name.builder()
        .title("Ms")
        .givenName("Pauline")
        .familyName("Hanson")
        .build())
      .sex(Sex.FEMALE)
      .individualEmail("pauline.hanson@onenation.org.au")
      .organisationEmail("hey@onenation.org.au")
      .phoneNumber("1300 857 466")
      .build();
  }

}