package org.serendipity.party.repository;

import org.serendipity.party.entity.Individual;
import org.serendipity.party.entity.Organisation;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface OrganisationRepository extends JpaRepository<Organisation, Long> {

  Optional<Organisation> findByPartyPublicId(String publicId);

  Page<Organisation> findByName(String name, Pageable pageable);
  Page<Organisation> findByNameStartsWith(String name, Pageable pageable);

  boolean existsByName(String name);

}

// https://docs.spring.io/spring-data/rest/docs/current/reference/html/#paging-and-sorting
