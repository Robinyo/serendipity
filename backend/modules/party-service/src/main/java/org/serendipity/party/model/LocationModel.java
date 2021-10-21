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

}
