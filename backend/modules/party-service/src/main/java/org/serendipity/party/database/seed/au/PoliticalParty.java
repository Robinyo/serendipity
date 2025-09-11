package org.serendipity.party.database.seed.au;

public enum PoliticalParty {

  AUSTRALIAN_CONSERVATIVE_PARTY("ACP") {
    @Override
    public String toString() {
      return "Australian Conservative Party";
    }
  },
  AUSTRALIAN_LABOR_PARTY("ALP") {
    @Override
    public String toString() { return "Australian Labor Party"; }
  },
  ANTI_SOCIALIST_PARTY("ANTI-SOC") {
    @Override
    public String toString() { return "Anti-Socialist Party"; }
  },
  AUSTRALIAN_SHOOTERS_PARTY("ASP") {
    @Override
    public String toString() { return "Australian Shooters Party"; }
  },
  NORTHERN_TERRITORY_COUNTRY_LIBERIAL_PARTY("CLP") {
    @Override
    public String toString() { return "Northern Territory Country Liberal Party"; }
  },
  AUSTRALIAN_COUNTRY_PARTY("CP") {
    @Override
    public String toString() { return "Australian Country Party"; }
  },
  AUSTRALIAN_DEMOCRATS("DEM") {
    @Override
    public String toString() { return "Australian Democrats"; }
  },
  FEDERAL_LABOR_PARTY("FLP") {
    @Override
    public String toString() { return "Federal Labor Party"; }
  },
  FARMERS_AND_SETTLERS_UNION("FSU") {
    @Override
    public String toString() { return "Farmers and Settlers Union"; }
  },
  FREE_TRADE("FT") {
    @Override
    public String toString() { return "Free Trade"; }
  },
  FARMERS_UNION("FU") {
    @Override
    public String toString() { return "Farmers Union"; }
  },
  AUSTRALIAN_GREENS("GRN") {
    @Override
    public String toString() { return "Australian Greens"; }
  },
  INDEPENDENT("IND") {
    @Override
    public String toString() { return "Independent"; }
  },
  INDEPENDENT_LABOR("IND LAB") {
    @Override
    public String toString() { return "Independent Labor"; }
  },



  LIBERAL_PARTY("LIB") {
    @Override
    public String toString() { return "Liberal Party"; }
  },



  LIBERAL_PARTY_OF_AUSTRALIA("LP") {
    @Override
    public String toString() { return "Liberal Party of Australia"; }
  },



  WESTERN_AUSTRALIA_PARTY("WAP") {
    @Override
    public String toString() { return "Western Australia Party"; }
  };

  private final String abbreviation;

  private PoliticalParty(String abbreviation) {
    this.abbreviation = abbreviation;
  }

  public static PoliticalParty valueOfAbbreviation(String abbreviation) {

    for (PoliticalParty e : values()) {
      if (e.abbreviation.equals(abbreviation)) {
        return e;
      }
    }

    return PoliticalParty.INDEPENDENT;

  }

}

// https://www.aec.gov.au/Electorates/party-codes.htm

