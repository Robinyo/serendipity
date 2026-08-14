package org.serendipity.party.database.seed.au;

import org.serendipity.party.entity.Name;
import org.serendipity.party.type.au.Sex;
import org.springframework.core.annotation.Order;
import org.springframework.stereotype.Component;

@Component
@Order(2)
public class AustralianGreens extends AbstractPoliticalPartySeed {

  @Override
  protected PoliticalPartyData getPartyData() {
    return PoliticalPartyData.builder()
      .politicalParty(PoliticalParty.AUSTRALIAN_GREENS)
      .headOfficeDisplayName("PO Box 1108, Canberra ACT 2601")
      .addressLine1("PO Box 1108")
      .city("Canberra")
      .state("ACT")
      .postalCode("2601")
      .primaryContactName(Name.builder()
        .title("Ms")
        .givenName("Larissa")
        .familyName("Waters")
        .build())
      .sex(Sex.FEMALE)
      .individualEmail("larissa.waters@greens.org.au")
      .organisationEmail("hey@greens.org.au")
      .phoneNumber("(02) 6140 3220")
      .build();
  }

}