package org.serendipity.party.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;
import org.serendipity.party.type.LocationType;

@Data
@EqualsAndHashCode(callSuper = false)
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class LocationModel {

  private String id;
  private LocationType type;
  private String displayName;
  private String fromDate;
  private String toDate;

}
