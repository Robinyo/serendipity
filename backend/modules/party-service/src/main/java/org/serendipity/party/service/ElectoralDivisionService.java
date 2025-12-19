package org.serendipity.party.service;

import org.serendipity.party.entity.ElectoralDivision;
import org.serendipity.party.repository.ElectoralDivisionRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.util.Optional;

@Service
public class ElectoralDivisionService {

  private final ElectoralDivisionRepository repository;

  public ElectoralDivisionService(ElectoralDivisionRepository repository) {
    this.repository = repository;
  }

  public Page<ElectoralDivision> findAll(Pageable pageable) {
    return repository.findAll(pageable);
  }

  public ElectoralDivision findByName(final String name) throws ResponseStatusException {
    return repository.findByName(name).orElseThrow(() ->
        new ResponseStatusException(HttpStatus.NOT_FOUND));
  }

}

/*

  public Optional<ElectoralDivision> findByName(final String name) {
    return repository.findByName(name);
  }

*/
