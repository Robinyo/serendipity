package org.serendipity.party.repository;

import org.serendipity.party.entity.Individual;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface IndividualRepository extends JpaRepository<Individual, Long> {

  Optional<Individual> findByPartyPublicId(String publicId);

  Page<Individual> findByNameFamilyNameStartsWith(String name, Pageable pageable);

  boolean existsByPartyPublicId(String publicId);

  void deleteByPartyPublicId(String publicId);

}

// https://docs.spring.io/spring-data/rest/docs/current/reference/html/#paging-and-sorting
