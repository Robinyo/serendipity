package org.serendipity.party.type.au;

import lombok.Getter;

@Getter
public enum RelationshipLifecycleStatus {

  NEVER_MARRIED(1) {
    @Override
    public String toString() {
      return "Never married";
    }
  },
  WIDOWED(2) {
    @Override
    public String toString() {
      return "Widowed";
    }
  },
  DIVORCED(3) {
    @Override
    public String toString() {
      return "Divorced";
    }
  },
  SEPARATED(4) {
    @Override
    public String toString() {
      return "Separated";
    }
  },
  MARRIED(5) {
    @Override
    public String toString() {
      return "Married";
    }
  },
  DE_FACTO_MARRIAGE(6) {
    @Override
    public String toString() {
      return "De facto Marriage";
    }
  },
  REGISTERED_MARRIAGE(7) {
    @Override
    public String toString() {
      return "Registered Marriage";
    }
  },
  NOT_STATED(9) {
    @Override
    public String toString() {
      return "Not stated / inadequately described";
    }
  };

  private final Integer code;

  private RelationshipLifecycleStatus(Integer code) {
    this.code = code;
  }

}
