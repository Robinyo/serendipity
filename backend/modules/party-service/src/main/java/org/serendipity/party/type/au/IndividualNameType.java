package org.serendipity.party.type.au;

public enum IndividualNameType {

  // Incorporated Private Sector Entities

  LEGAL_NAME("LGL") { // Principle name
    @Override
    public String toString() {
      return "Legal name";
    }
  },
  ALIAS("AKA") {
    @Override
    public String toString() {
      return "Alias";
    }
  },
  BIRTH_NAME("BTH") { // AKA
    @Override
    public String toString() {
      return "Name at birth";
    }
  },
  MAIDEN_NAME("MDN") {
    @Override
    public String toString() {
      return "Maiden name";
    }
  },
  NEWBORN_IDENTIFICATION_NAME("NEW") {
    @Override
    public String toString() {
      return "Newborn identification name";
    }
  },
  OTHER_NAME("OTH") {
    @Override
    public String toString() {
      return "Other name";
    }
  },
  PROFESSIONAL_NAME("PBN") { // Trading name
    @Override
    public String toString() {
      return "Professional or business name";
    }
  },
  PREVIOUS_NAME("PRV") {
    @Override
    public String toString() {
      return "Previous name";
    }
  },
  PREFERRED_NAME("PRF") {
    @Override
    public String toString() {
      return "Preferred name";
    }
  },
  TRIBAL_NAME("TRB") {
    @Override
    public String toString() {
      return "Tribal name";
    }
  };

  private final String code;

  private IndividualNameType(String code) {
    this.code = code;
  }

}
