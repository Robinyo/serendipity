package org.serendipity.party.database.seed.au;

import org.serendipity.party.entity.Name;
import org.serendipity.party.type.au.Sex;
import org.springframework.core.annotation.Order;
import org.springframework.stereotype.Component;

@Component
@Order(2)
public class CentreAlliance extends AbstractPoliticalPartySeed {

  @Override
  protected PoliticalPartyData getPartyData() {
    return PoliticalPartyData.builder()
      .politicalParty(PoliticalParty.CENTRE_ALLIANCE)
      .headOfficeDisplayName("100 Waymouth Street Adelaide SA 5000")
      .addressLine1("100 Waymouth Street")
      .city("Adelaide")
      .state("SA")
      .postalCode("5000")
      .primaryContactName(Name.builder()
        .title("Ms")
        .givenName("Rebekha")
        .familyName("Sharkie")
        .build())
      .sex(Sex.FEMALE)
      .individualEmail("rebekha.sharkie@centreforchange.com.au")
      .organisationEmail("contact@centreonline.org.au")
      .phoneNumber("(08) 8212 5555")
      .build();
  }

}
