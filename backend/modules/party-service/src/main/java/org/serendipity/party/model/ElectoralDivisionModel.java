package org.serendipity.party.model;

import lombok.*;
import org.springframework.hateoas.RepresentationModel;

import java.time.LocalDateTime;

@Data
@EqualsAndHashCode(callSuper = true)
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class ElectoralDivisionModel extends RepresentationModel<ElectoralDivisionModel> {

  private String publicId;
  private String name;
  private String nameDerivation;
  private String state;
  private String area;
  private String locationDescription;
  private LocalDateTime dateGazetted;
  private String latitude;
  private String longitude;

}
