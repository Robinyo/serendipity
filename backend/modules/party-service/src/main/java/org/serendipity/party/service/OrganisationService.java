package org.serendipity.party.service;

import lombok.RequiredArgsConstructor;
import org.serendipity.party.entity.Organisation;
import org.serendipity.party.exception.ResourceNotFoundException;
import org.serendipity.party.repository.OrganisationRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class OrganisationService {

  private final OrganisationRepository repository;

  @Transactional(readOnly = true)
  public Page <Organisation> findAll(Pageable pageable) {
    return repository.findAll(pageable);
  }

  @Transactional(readOnly = true)
  public Organisation findByPartyPublicId(String publicId) {
    return repository.findByPartyPublicId(publicId)
      .orElseThrow(() -> new ResourceNotFoundException("Organisation not found with id: " + publicId));
  }

  // @Transactional(readOnly = true)
  // public Organisation findById(final Long id) throws ResponseStatusException {
  //   return repository.findById(id).orElseThrow(() ->
  //       new ResponseStatusException(HttpStatus.NOT_FOUND));
  // }

  @Transactional(readOnly = true)
  public Page<Organisation> findByName(final String name, Pageable pageable) {
    return repository.findByName(name, pageable);
  }

  @Transactional(readOnly = true)
  public Page<Organisation> findByNameStartsWith(final String name, Pageable pageable) {
    return repository.findByNameStartsWith(name, pageable);
  }

  @Transactional(readOnly = true)
  public boolean existsByName(String name) {
    return repository.existsByName(name);
  }

  @Transactional
  public Organisation save(Organisation individual) {
    return repository.save(individual);
  }

  @Transactional
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
