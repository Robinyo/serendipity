package org.serendipity.party.model;

import lombok.*;
import org.springframework.hateoas.RepresentationModel;

import java.time.LocalDateTime;

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
  private LocalDateTime dateGazetted;
  private String latitude;
  private String longitude;

  @Override
  public boolean equals(Object o) {

    if (this == o)
      return true;

    if (!(o instanceof ElectoralDivisionModel))
      return false;

    ElectoralDivisionModel other = (ElectoralDivisionModel) o;

    return id != null && id.equals(other.getId());
  }

  @Override
  public int hashCode() {
    return getClass().hashCode();
  }

}
