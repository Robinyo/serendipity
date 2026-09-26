package org.serendipity.party.database.seed.au;

import org.serendipity.party.entity.Name;
import org.serendipity.party.type.au.Sex;
import org.springframework.core.annotation.Order;
import org.springframework.stereotype.Component;

@Component
@Order(2)
public class JacquiLambieNetwork extends AbstractPoliticalPartySeed {

  @Override
  protected PoliticalPartyData getPartyData() {
    return PoliticalPartyData.builder()
      .politicalParty(PoliticalParty.JACQUI_LAMIBE_NETWORK)
      .headOfficeDisplayName("Level 1, 106 Liverpool Street Glenorchy TAS 7010")
      .addressLine1("Level 1, 106 Liverpool Street")
      .city("Glenorchy")
      .state("TAS")
      .postalCode("7010")
      .primaryContactName(Name.builder()
        .title("Ms")
        .givenName("Jacqui")
        .familyName("Lambie")
        .build())
      .sex(Sex.FEMALE)
      .individualEmail("jacqui.lambie@jln.org.au")
      .organisationEmail("contact@jln.org.au")
      .phoneNumber("(03) 6271 5555")
      .build();
  }

}
