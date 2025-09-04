package org.serendipity.party.type.au;

// Australian Standard 4590.1:2017

import lombok.Getter;

@Getter
public enum Sex {

  MALE(1) {
    @Override
    public String toString() {
      return "Male";
    }
  },
  FEMALE(2) {
    @Override
    public String toString() {
      return "Female";
    }
  },
  INDETERMINATE(3) {
    @Override
    public String toString() {
      return "Indeterminate";
    }
  },
  NOT_STATED(9) {
    @Override
    public String toString() {
      return "Not stated / Inadequately described";
    }
  };

  private final Integer code;

  private Sex(Integer code) {
    this.code = code;
  }

}
