package org.serendipity.party.entity;

import lombok.*;

import javax.persistence.*;
import java.util.HashSet;
import java.util.Set;

@Entity
@Builder
@AllArgsConstructor
@NoArgsConstructor
@Setter
@Getter
public class Address {
  
  @Id
  private Long id;
  
  @OneToOne(fetch = FetchType.EAGER)
  @JoinColumn(name = "locationId")
  @MapsId
  private Location location;
  
  private String name;
  
  private String line1;
  
  private String line2;
  
  private String city;
  
  private String state;
  
  private String postalCode;
  
  private String country;
  
  private String addressType;

  @Override
  public boolean equals(Object o) {

    if (this == o)
      return true;

    if (!(o instanceof Address))
      return false;

    Address other = (Address) o;

    // return id != 0L && id == other.getId();
    return id != 0L && id.equals(other.getId());
  }

  @Override
  public int hashCode() {
    return 31;
  }  

}

// https://github.com/GeoscienceAustralia/AS4590-codelists
// https://toolkit.data.gov.au/Publishing_your_data.html
