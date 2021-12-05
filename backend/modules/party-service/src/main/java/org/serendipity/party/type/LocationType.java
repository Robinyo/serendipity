package org.serendipity.party.type;

public enum LocationType {

  ADDRESS {
    @Override
    public String toString() {
      return "Address";
    }
  },
  ELECTRONIC_ADDRESS {
    @Override
    public String toString() {
      return "Electronic Address";
    }
  }

}

// type = "Address" | "Natural Area" | "Management Zone"

/*

  LOCATION {
    @Override
    public String toString() {
      return "Location";
    }
  }

*/
