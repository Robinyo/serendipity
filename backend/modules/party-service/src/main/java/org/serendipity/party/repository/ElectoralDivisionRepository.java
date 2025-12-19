package org.serendipity.party.repository;

import org.serendipity.party.entity.ElectoralDivision;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.repository.CrudRepository;
import org.springframework.data.repository.PagingAndSortingRepository;

import java.util.Optional;

public interface ElectoralDivisionRepository extends CrudRepository<ElectoralDivision, Long>, PagingAndSortingRepository<ElectoralDivision, Long> {

  // Page<ElectoralDivision> findAll(Pageable pageable);

  Optional<ElectoralDivision> findByName(String name);

}
