package org.serendipity.party.model;

import lombok.*;
import org.serendipity.party.type.LocationType;

import java.util.Date;

@Builder
@AllArgsConstructor
@NoArgsConstructor
@Setter
@Getter
public class LocationModel {

  private Long id;
  private LocationType type;
  private String displayName;
  private Date fromDate;
  private Date toDate;

  @Override
  public boolean equals(Object o) {

    if (this == o)
      return true;

    if (!(o instanceof LocationModel))
      return false;

    LocationModel other = (LocationModel) o;

    return id != 0L && id.equals(other.getId());
  }

  @Override
  public int hashCode() {
    return 31;
  }

}
