package org.serendipity.party.database.seed.au;

public enum PoliticalParty {

  AUSTRALIAN_GREENS("AG") {
    @Override
    public String toString() {
      return "Australian Greens";
    }
  },
  AUSTRALIAN_LABOR_PARTY("ALP") {
    @Override
  public String toString() {
    return "Australian Labor Party";
  }
  },
  CENTRE_ALLIANCE("CA") {
    @Override
    public String toString() {
      return "Centre Alliance";
    }
  },
  JACQUI_LAMBIE_NETWORK("JLN") {
    @Override
    public String toString() {
      return "Jacqui Lambie Network";
    }
  },
  LIBERAL_NATIONAL_PARTY_OF_QUEENSLAND("LNP") {
    @Override
    public String toString() {
      return "Liberal National Party of Queensland";
    }
  },
  LIBERAL_PARTY_OF_AUSTRALIA("LP") {
    @Override
    public String toString() {
      return "Liberal Party of Australia";
    }
  },
  NATIONAL_PARTY_OF_AUSTRALIA("NATS") {
    @Override
    public String toString() {
      return "National Party of Australia";
    }
  },
  PAULINE_HANSONS_ONE_NATION("PHON") {
    @Override
    public String toString() {
      return "Pauline Hanson's One Nation";
    }
  },
  INDEPENDENT("IND") {
    @Override
    public String toString() {
      return "Independent";
    }
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

