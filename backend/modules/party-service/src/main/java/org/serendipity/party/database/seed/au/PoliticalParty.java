package org.serendipity.party.database.seed.au;

public enum PoliticalParty {

  AUSTRALIAN_GREENS("AG") {
    @Override
    public String toString() { return "Australian Greens"; }
  },

  AUSTRALIAN_LABOR_PARTY("ALP") {
    @Override
    public String toString() { return "Australian Labor Party"; }
  },

  INDEPENDENT("IND") {
    @Override
    public String toString() { return "Independent"; }
  },

  LIBERAL_NATIONAL_PARTY_OF_QUEENSLAND("LNP") {
    @Override
    public String toString() {
      return "Liberal National Party of Queensland";
    }
  },

  // Liberal Party of Australia: LP or LIB
  LIBERAL_PARTY("LP") {
    @Override
    public String toString() { return "Liberal Party of Australia"; }
  },
  LIBERAL_PARTY_OF_AUSTRALIA("LIB") {
    @Override
    public String toString() { return "Liberal Party of Australia"; }
  },

  NATIONAL_PARTY_OF_AUSTRALIA("NATS") {
    @Override
    public String toString() { return "National Party of Australia"; }
  },

  PAULINE_HANSONS_ONE_NATION("PHON", "ON") {
    @Override
    public String toString() { return "Pauline Hanson's One Nation"; }
  },

  AUSTRALIA_S_VOICE("AV") {
    @Override
    public String toString() { return "Australia's Voice"; }
  },

  COUNTRY_LIBERAL_PARTY("CLP") {
    @Override
    public String toString() { return "Country Liberal Party (Northern Territory)"; }
  },

  JACQUI_LAMIBE_NETWORK("JLN") {
    @Override
    public String toString() { return "Jacqui Lambie Network"; }
  },

  UNITED_AUSTRALIA_PARTY("UAP") {
    @Override
    public String toString() { return "United Australia Party"; }
  },

  CENTRE_ALLIANCE("CA") {
    @Override
    public String toString() { return "Centre Alliance"; }
  },

  KATTER_S_AUSTRALIAN_PARTY("KAP") {
    @Override
    public String toString() { return "Katter's Australian Party"; }
  };

  private final String[] abbreviations;

  PoliticalParty(String... abbreviations) {
    this.abbreviations = abbreviations;
  }

  public static PoliticalParty valueOfAbbreviation(String abbreviation) {

    for (PoliticalParty e : values()) {
      for (String a : e.abbreviations) {
        if (a.equals(abbreviation)) {
          return e;
        }
      }
    }

    return PoliticalParty.INDEPENDENT;
  }

}
