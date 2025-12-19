package org.serendipity.party.service;

import org.serendipity.party.entity.Individual;
import org.serendipity.party.repository.IndividualRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.util.Optional;

@Service
public class IndividualService {

  private final IndividualRepository repository;

  public IndividualService(IndividualRepository repository) {
    this.repository = repository;
  }

  public Page<Individual> findAll(Pageable pageable) {
    return repository.findAll(pageable);
  }

  public Individual findById(final Long id) throws ResponseStatusException {
    return repository.findById(id).orElseThrow(() ->
        new ResponseStatusException(HttpStatus.NOT_FOUND));
  }

  /*

  public Optional<Individual> findById(final Long id) {
    return repository.findById(id);
  }

  */

  public Page<Individual> findByNameFamilyNameStartsWith(final String name, Pageable pageable) {
    return repository.findByNameFamilyNameStartsWith(name, pageable);
  }

  public Individual save(Individual individual) {
    return repository.save(individual);
  }

  public void deleteById(final Long id) {
    repository.deleteById(id);
  }

}

// How Spring Handles ResponseStatusException
// Spring's default mechanisms (specifically the ResponseStatusExceptionResolver) are designed to automatically
// process ResponseStatusException instances and translate them into appropriate HTTP responses with the correct
// status code and message.
// If you throw a ResponseStatusException in your controller or service layer, Spring will automatically use its
// properties to return a proper error response.
