package org.serendipity.party.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.serendipity.party.type.LocationType;

import java.time.LocalDateTime;

@Builder
@AllArgsConstructor
@NoArgsConstructor
@Setter
@Getter
public class LocationModel {

  private Long id;
  private LocationType type;
  private String displayName;
  private LocalDateTime fromDate;
  private LocalDateTime toDate;

  @Override
  public boolean equals(Object o) {

    if (this == o)
      return true;

    if (!(o instanceof LocationModel))
      return false;

    LocationModel other = (LocationModel) o;

    return id != null && id.equals(other.getId());
  }

  @Override
  public int hashCode() {
    return getClass().hashCode();
  }

}
