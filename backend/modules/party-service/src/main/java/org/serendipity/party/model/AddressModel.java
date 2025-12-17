package org.serendipity.party.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.springframework.hateoas.RepresentationModel;

@Builder
@AllArgsConstructor
@NoArgsConstructor
@Setter
@Getter
public class AddressModel extends RepresentationModel<AddressModel> {

  private Long id;
  private LocationModel location;
  private String name;
  private String line1;
  private String line2;
  private String city;
  private String state;
  private String postalCode;
  private String country;
  private String addressType;

  // private double latitude;
  // private double longitude;

  @Override
  public boolean equals(Object o) {

    if (this == o)
      return true;

    if (!(o instanceof AddressModel))
      return false;

    AddressModel other = (AddressModel) o;

    return id != 0L && id.equals(other.getId());
  }

  @Override
  public int hashCode() {
    return 31;
  }

}
