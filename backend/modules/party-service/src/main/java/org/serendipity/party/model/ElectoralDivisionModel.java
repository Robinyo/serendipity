package org.serendipity.party.model;

import lombok.*;
import org.springframework.hateoas.RepresentationModel;

import java.util.Date;

@Builder
@AllArgsConstructor
@NoArgsConstructor
@Setter
@Getter
public class ElectoralDivisionModel extends RepresentationModel<ElectoralDivisionModel> {

  private Long id;
  private String name;
  private String nameDerivation;
  private String state;
  private String area;
  private String locationDescription;
  private Date dateGazetted;
  private String latitude;
  private String longitude;

}
