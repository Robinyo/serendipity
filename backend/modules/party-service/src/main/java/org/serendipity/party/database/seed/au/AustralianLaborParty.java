package org.serendipity.party.database.seed.au;

import org.serendipity.party.entity.Name;
import org.serendipity.party.type.au.Sex;
import org.springframework.core.annotation.Order;
import org.springframework.stereotype.Component;

@Component
@Order(2)
public class AustralianLaborParty extends AbstractPoliticalPartySeed {

  @Override
  protected PoliticalPartyData getPartyData() {
    return PoliticalPartyData.builder()
      .politicalParty(PoliticalParty.AUSTRALIAN_LABOR_PARTY)
      .headOfficeDisplayName("5/9 Sydney Avenue Barton ACT 2600")
      .addressLine1("5/9 Sydney Avenue")
      .city("Barton")
      .state("ACT")
      .postalCode("2600")
      .primaryContactName(Name.builder()
        .title("Mr")
        .givenName("Wayne")
        .familyName("Swan")
        .build())
      .sex(Sex.MALE)
      .individualEmail("wayne.swan@alp.org.au")
      .organisationEmail("hey@alp.org.au")
      .phoneNumber("(02) 6120 0800")
      .build();
  }

}