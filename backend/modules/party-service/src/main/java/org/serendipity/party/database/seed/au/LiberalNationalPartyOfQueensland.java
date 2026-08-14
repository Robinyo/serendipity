package org.serendipity.party.database.seed.au;

import org.serendipity.party.entity.Name;
import org.serendipity.party.type.au.Sex;
import org.springframework.core.annotation.Order;
import org.springframework.stereotype.Component;

@Component
@Order(2)
public class LiberalNationalPartyOfQueensland extends AbstractPoliticalPartySeed {

  @Override
  protected PoliticalPartyData getPartyData() {
    return PoliticalPartyData.builder()
      .politicalParty(PoliticalParty.LIBERAL_NATIONAL_PARTY_OF_QUEENSLAND)
      .headOfficeDisplayName("281 Sandgate Road Albion QLD 4010")
      .addressLine1("281 Sandgate Road")
      .city("Albion")
      .state("QLD")
      .postalCode("4010")
      .primaryContactName(Name.builder()
        .title("Mr")
        .givenName("David")
        .familyName("Hutchinson")
        .build())
      .sex(Sex.MALE)
      .individualEmail("david.hutchinson@lnp.org.au")
      .organisationEmail("info@lnp.org.au")
      .phoneNumber("(07) 3844 0666")
      .build();
  }

}