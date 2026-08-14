package org.serendipity.party.repository;

import org.serendipity.party.entity.Identifier;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

public interface IdentifierRepository extends JpaRepository<Identifier, Long> {

  // Page<Identifier> findAll(Pageable pageable);

  Page<Identifier> findByType(String type, Pageable pageable);

}
