package org.serendipity.party.entity;

import lombok.*;

import javax.persistence.*;
import java.util.Date;

@Entity
@Builder
@AllArgsConstructor
@NoArgsConstructor
@Setter
@Getter
@Table(indexes = { @Index(name = "ELECTORAL_DIVISION_NAME_INDEX", columnList = "name", unique = true) })
public class ElectoralDivision {

  @Id
  @GeneratedValue(
    strategy = GenerationType.SEQUENCE,
    generator = "SequenceElectoralDivision")
  @SequenceGenerator(
    name = "SequenceElectoralDivision",
    allocationSize = 1
  )
  private Long id;

  @Column(name = "name", nullable = false)
  private String name;

  private String nameDerivation;

  private String state;

  private String area;

  private String locationDescription;

  @Temporal(TemporalType.DATE)
  private Date dateGazetted;

  private String latitude;

  private String longitude;

}
