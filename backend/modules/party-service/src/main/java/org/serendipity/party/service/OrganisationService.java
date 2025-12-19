package org.serendipity.party.service;

import org.serendipity.party.entity.Organisation;
import org.serendipity.party.repository.OrganisationRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

@Service
public class OrganisationService {

  private final OrganisationRepository repository;

  public OrganisationService(OrganisationRepository repository) {
    this.repository = repository;
  }

  public Page <Organisation> findAll(Pageable pageable) {
    return repository.findAll(pageable);
  }

  public Organisation findById(final Long id) throws ResponseStatusException {
    return repository.findById(id).orElseThrow(() ->
        new ResponseStatusException(HttpStatus.NOT_FOUND));
  }

  public Page<Organisation> findByNameStartsWith(final String name, Pageable pageable) {
    return repository.findByNameStartsWith(name, pageable);
  }

  public Organisation save(Organisation individual) {
    return repository.save(individual);
  }

  public void deleteById(final Long id) {
    repository.deleteById(id);
  }

}

/*

  private final OrganisationRepository repository;

  public OrganisationService(OrganisationRepository repository) {
    this.repository = repository;
  }

@Service
public class OrganisationService extends BaseService<Organisation, OrganisationRepository> {

  public OrganisationService(OrganisationRepository repository) {
    super(repository);
  }

  public Page <Organisation> findAll(Pageable pageable) {
    return repository.findAll(pageable);
  }

  public Organisation findById(final Long id) throws ResponseStatusException {
    return repository.findById(id).orElseThrow(() ->
        new ResponseStatusException(HttpStatus.NOT_FOUND));
  }

}

*/
