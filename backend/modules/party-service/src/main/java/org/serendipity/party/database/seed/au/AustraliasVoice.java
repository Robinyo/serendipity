package org.serendipity.party.database.seed.au;

import org.serendipity.party.entity.Name;
import org.serendipity.party.type.au.Sex;
import org.springframework.core.annotation.Order;
import org.springframework.stereotype.Component;

@Component
@Order(2)
public class AustraliasVoice extends AbstractPoliticalPartySeed {

  @Override
  protected PoliticalPartyData getPartyData() {
    return PoliticalPartyData.builder()
      .politicalParty(PoliticalParty.AUSTRALIA_S_VOICE)
      .headOfficeDisplayName("Unit 3, 10 Moore Street Turner ACT 2612")
      .addressLine1("Unit 3, 10 Moore Street")
      .city("Turner")
      .state("ACT")
      .postalCode("2612")
      .primaryContactName(Name.builder()
        .title("Ms")
        .givenName("Fatima")
        .familyName("Payman")
        .build())
      .sex(Sex.FEMALE)
      .individualEmail("fatima.payman@adavies.com.au")
      .organisationEmail("contact@australiasvoice.org.au")
      .phoneNumber("(02) 9380 5555")
      .build();
  }

}
