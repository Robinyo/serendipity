package org.serendipity.party.entity;

import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.Id;
import jakarta.persistence.Index;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.MapsId;
import jakarta.persistence.OneToOne;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "address",
    indexes = { @Index(name = "address_name_idx", columnList = "name", unique = false) })
@Builder
@AllArgsConstructor
@NoArgsConstructor
@Setter
@Getter
public class Address {

  // Shared Primary Key pattern (@MapsId) between Address and Location.
  // No generator needed because @MapsId derives the ID straight from Location.
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

    return id != null && id.equals(other.getId());
  }

  @Override
  public int hashCode() {
    return getClass().hashCode();
  }  

}

// https://github.com/GeoscienceAustralia/AS4590-codelists
// https://toolkit.data.gov.au/Publishing_your_data.html
