package org.serendipity.party.type.au;

// Australian Standard 4590.1:2017
// https://rob-ferguson.me/data-model-patterns/

import lombok.Getter;

@Getter
public enum LegalType {

  // Incorporated Private Sector Entities

  PROPRIETARY_COMPANY(11) {
    @Override
    public String toString() {
      return "Proprietary Company";
    }
  },
  PUBLIC_COMPANY(12) {
    @Override
    public String toString() {
      return "Public Company";
    }
  },
  OTHER_INCORPORATED_ENTITY(13) {
    @Override
    public String toString() {
      return "Other Incorporated Entity";
    }
  },

  // Unincorporated Private Sector Entities

  SOLE_PROPRIETORSHIP(21) { // Sole Trader
    @Override
    public String toString() {
      return "Sole Proprietorship";
    }
  },
  FAMILY_PARTNERSHIP(22) {
    @Override
    public String toString() {
      return "Family Partnership";
    }
  },
  OTHER_PARTNERSHIP(23) {
    @Override
    public String toString() {
      return "Other Partnership";
    }
  },
  TRUST_REGARDED_AS_A_CORPORATION(24) {
    @Override
    public String toString() {
      return "Trust regarded as a Corporation";
    }
  },
  OTHER_TRUST(25) {
    @Override
    public String toString() {
      return "Other Trust";
    }
  },
  OTHER_UNINCORPORATED_ENTITY(26) {
    @Override
    public String toString() {
      return "Other Unincorporated Entity";
    }
  },

  // Public Sector Entities

  GOVERNMENT_COMPANY(31) {
    @Override
    public String toString() {
      return "Government Company";
    }
  },
  OTHER_GOVERNMENT_ENTITY(32) {
    @Override
    public String toString() {
      return "Other Government Entity";
    }
  },
  FOREIGN_GOVERNMENT_ENTITY(33) {
    @Override
    public String toString() {
      return "Foreign Government Entity";
    }
  };

  private final Integer code;

  private LegalType(Integer code) {
    this.code = code;
  }

}

/*

Incorporated Association
Unincorporated Association
Body Corporate
Cooperative
Estate
Joint Venture
Not For Profit

*/
