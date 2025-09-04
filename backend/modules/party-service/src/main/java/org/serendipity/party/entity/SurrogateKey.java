package org.serendipity.party.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Embeddable;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;

//
// A surrogate key is any column or set of columns that can be declared as the primary key instead of a "real" or
// natural key. Sometimes there can be several natural keys that could be declared as the primary key, and these
// are all called candidate keys. So a surrogate is a candidate key.
//

@Embeddable
public class SurrogateKey {

  @Id
  @GeneratedValue(strategy = GenerationType.SEQUENCE)
  @Column(name = "id", nullable = false)
  private Long id;
  
  //
  // MongoDB
  //
  // private String id;

}
