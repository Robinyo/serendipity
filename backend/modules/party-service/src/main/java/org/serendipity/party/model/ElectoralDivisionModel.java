package org.serendipity.party.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;
import org.springframework.hateoas.RepresentationModel;

@Data
@EqualsAndHashCode(callSuper = true)
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class ElectoralDivisionModel extends RepresentationModel<ElectoralDivisionModel> {

  private String id;
  private String name;
  private String nameDerivation;
  private String state;
  private String area;
  private String locationDescription;
  private String dateGazetted;
  private String latitude;
  private String longitude;

}
