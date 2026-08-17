package org.serendipity.party.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Embedded;
import jakarta.persistence.Entity;
import jakarta.persistence.EntityListeners;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Index;
import jakarta.persistence.SequenceGenerator;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.hibernate.annotations.SQLRestriction;
// import org.hibernate.envers.Audited;
import org.serendipity.party.type.PartyType;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import java.time.LocalDate;
import java.util.UUID;

// @Table(name = "Role"

@Entity
@Table(name = "role",
    indexes = { @Index(name = "role_public_id_idx", columnList = "publicId"),
                @Index(name = "role_party_public_id_idx", columnList = "partyPublicId", unique = false) })
@SQLRestriction("to_date IS NULL OR to_date > CURRENT_DATE")
@Builder
@AllArgsConstructor
@NoArgsConstructor
@Setter
@Getter
// @Audited
@EntityListeners(AuditingEntityListener.class)
public class Role {

  @Id
  @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "SequenceRole")
  @SequenceGenerator(name = "SequenceRole", allocationSize = 1)
  private Long id;

  @Builder.Default
  @Column(nullable = false, unique = true, updatable = false, length = 36)
  private String publicId = UUID.randomUUID().toString();

  @Builder.Default
  private String role = "Member";

  @Column(nullable = false, length = 36)
  private String partyPublicId;

  @Column(nullable = false)
  @Enumerated(EnumType.STRING)
  private PartyType partyType;

  @Column(nullable = false)
  private String partyName;

  @Column(nullable = false)
  private String partyEmail;

  @Column(nullable = false)
  private String partyPhoneNumber;

  @Builder.Default
  private String relationship = "Membership";

  @Builder.Default
  private String reciprocalRole = "Organisation";

  @Column(nullable = false, length = 36)
  private String reciprocalPartyPublicId;

  @Column(nullable = false)
  @Enumerated(EnumType.STRING)
  private PartyType reciprocalPartyType;

  @Column(nullable = false)
  private String reciprocalPartyName;

  @Column(nullable = false)
  private String reciprocalPartyEmail;

  @Column(nullable = false)
  private String reciprocalPartyPhoneNumber;

  private LocalDate fromDate;

  private LocalDate toDate;

  @Embedded
  private Auditable audit;

  @Override
  public boolean equals(Object o) {

    if (this == o)
      return true;

    if (!(o instanceof Role))
      return false;

    Role other = (Role) o;

    return id != null && id.equals(other.getId());
  }

  @Override
  public int hashCode() {
    return getClass().hashCode();
  }

}

// https://jsonapi.org/format/#document-resource-object-relationships
