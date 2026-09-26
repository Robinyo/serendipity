package org.serendipity.party.database.seed.au;

import org.serendipity.party.entity.Name;
import org.serendipity.party.type.au.Sex;
import org.springframework.core.annotation.Order;
import org.springframework.stereotype.Component;

@Component
@Order(2)
public class KatterSAustralianParty extends AbstractPoliticalPartySeed {

  @Override
  protected PoliticalPartyData getPartyData() {
    return PoliticalPartyData.builder()
      .politicalParty(PoliticalParty.KATTER_S_AUSTRALIAN_PARTY)
      .headOfficeDisplayName("Level 1, 120 Flinders Street Townsville QLD 4810")
      .addressLine1("Level 1, 120 Flinders Street")
      .city("Townsville")
      .state("QLD")
      .postalCode("4810")
      .primaryContactName(Name.builder()
        .title("Mr")
        .givenName("Bob")
        .familyName("Katter")
        .build())
      .sex(Sex.MALE)
      .individualEmail("bob.katter@katter.org.au")
      .organisationEmail("contact@katter.org.au")
      .phoneNumber("(07) 4771 5555")
      .build();
  }

}
