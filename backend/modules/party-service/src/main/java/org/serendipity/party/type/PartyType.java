package org.serendipity.party.type;

public enum PartyType {

  INDIVIDUAL {
    @Override
    public String toString() {
      return "INDIVIDUAL";
    }
  },
  ORGANISATION {
    @Override
    public String toString() {
      return "ORGANISATION";
    }
  },
  ORGANISATIONAL_UNIT {
    @Override
    public String toString() {
      return "ORGANISATIONAL_UNIT";
    }
  }

}

// https://google.github.io/styleguide/javaguide.html#s4.8.1-enum-classes

/*

public enum PartyType {

  @JsonProperty("INDIVIDUAL")
  INDIVIDUAL {
    @Override
    public String toString() {
      return "Individual";
      }
  },
  @JsonProperty("ORGANISATION")
  ORGANISATION {
    @Override
    public String toString() {
      return "Organisation";
    }
  },
  @JsonProperty("ORGANISATIONAL_UNIT")
  ORGANISATIONAL_UNIT {
    @Override
    public String toString() {
      return "Organisational Unit";
    }
  }

}

*/

/*

  // EMPLOYMENT_POSITION {
  //   @Override
  //   public String toString() {
  //     return "Employment Position";
  //   }
  // },

  PARTY {
    @Override
    public String toString() {
      return "Party";
    }
  }

*/
