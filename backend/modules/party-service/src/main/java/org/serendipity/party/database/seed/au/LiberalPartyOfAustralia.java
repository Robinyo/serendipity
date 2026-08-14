package org.serendipity.party.database.seed.au;

import org.serendipity.party.entity.Name;
import org.serendipity.party.type.au.Sex;
import org.springframework.core.annotation.Order;
import org.springframework.stereotype.Component;

@Component
@Order(2)
public class LiberalPartyOfAustralia extends AbstractPoliticalPartySeed {

  @Override
  protected PoliticalPartyData getPartyData() {
    return PoliticalPartyData.builder()
      .politicalParty(PoliticalParty.LIBERAL_PARTY_OF_AUSTRALIA)
      .headOfficeDisplayName("Cnr Blackall and Macquarie Streets Barton ACT 2600")
      .addressLine1("Cnr Blackall and Macquarie Streets")
      .city("Barton")
      .state("ACT")
      .postalCode("2600")
      .primaryContactName(Name.builder()
        .title("Mr")
        .givenName("John")
        .familyName("Olsen")
        .build())
      .sex(Sex.MALE)
      .individualEmail("john.olsen@liberal.org.au")
      .organisationEmail("hey@liberal.org.au")
      .phoneNumber("(02) 6273 2564")
      .build();
  }
}