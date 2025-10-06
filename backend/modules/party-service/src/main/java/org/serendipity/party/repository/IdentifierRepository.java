package org.serendipity.party.repository;

import org.serendipity.party.entity.Identifier;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.repository.CrudRepository;
import org.springframework.data.repository.PagingAndSortingRepository;

public interface IdentifierRepository extends CrudRepository<Identifier, Long>, PagingAndSortingRepository<Identifier, Long> {

  Page<Identifier> findAll(Pageable pageable);

  Page<Identifier> findByType(String type, Pageable pageable);

}
