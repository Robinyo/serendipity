package org.serendipity.party.repository;

import org.serendipity.party.entity.Organisation;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.repository.CrudRepository;
import org.springframework.data.repository.PagingAndSortingRepository;

public interface OrganisationRepository extends CrudRepository<Organisation, Long>, PagingAndSortingRepository<Organisation, Long> {

  Page<Organisation> findAll(Pageable pageable);

  Page<Organisation> findByName(String name, Pageable pageable);
  Page<Organisation> findByNameStartsWith(String name, Pageable pageable);

}

// https://docs.spring.io/spring-data/rest/docs/current/reference/html/#paging-and-sorting
