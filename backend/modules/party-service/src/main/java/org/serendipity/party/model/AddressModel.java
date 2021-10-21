package org.serendipity.party.model;

import lombok.*;
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

}
