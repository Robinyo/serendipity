package org.serendipity.party.repository;

import org.serendipity.party.entity.Individual;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.repository.CrudRepository;
import org.springframework.data.repository.PagingAndSortingRepository;

import java.util.Optional;

public interface IndividualRepository extends CrudRepository<Individual, Long>, PagingAndSortingRepository<Individual, Long> {

  Page<Individual> findByNameFamilyNameStartsWith(String name, Pageable pageable);

}

// https://docs.spring.io/spring-data/rest/docs/current/reference/html/#paging-and-sorting

// Page<Individual> findAll(Pageable pageable);
