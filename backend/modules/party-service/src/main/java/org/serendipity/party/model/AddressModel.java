package org.serendipity.party.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.springframework.hateoas.RepresentationModel;

@Data
@EqualsAndHashCode(callSuper = true)
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class AddressModel extends RepresentationModel<AddressModel> {

  private String locationPublicId;
  private String name;
  private String line1;
  private String line2;
  private String city;              // Suburb / Locality
  private String state;             // State / Territory
  private String postalCode;        // Postcode
  private String country;
  private String addressType;

  // private double latitude;
  // private double longitude;

}
