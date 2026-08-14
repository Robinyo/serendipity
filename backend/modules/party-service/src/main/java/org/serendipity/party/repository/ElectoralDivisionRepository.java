package org.serendipity.party.repository;

import org.serendipity.party.entity.ElectoralDivision;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface ElectoralDivisionRepository extends JpaRepository<ElectoralDivision, Long> {

  // Page<ElectoralDivision> findAll(Pageable pageable);

  Optional<ElectoralDivision> findByName(String name);

}
