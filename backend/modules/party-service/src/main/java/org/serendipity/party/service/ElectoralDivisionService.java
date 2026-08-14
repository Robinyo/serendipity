package org.serendipity.party.service;

import lombok.RequiredArgsConstructor;
import org.serendipity.party.entity.ElectoralDivision;
import org.serendipity.party.entity.Individual;
import org.serendipity.party.repository.ElectoralDivisionRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.util.Optional;

@Service
@RequiredArgsConstructor
public class ElectoralDivisionService {

  private final ElectoralDivisionRepository repository;

  @Transactional(readOnly = true)
  public Page<ElectoralDivision> findAll(Pageable pageable) {
    return repository.findAll(pageable);
  }

  @Transactional(readOnly = true)
  public ElectoralDivision findByName(final String name) throws ResponseStatusException {
    return repository.findByName(name).orElseThrow(() ->
        new ResponseStatusException(HttpStatus.NOT_FOUND));
  }

  @Transactional(readOnly = true)
  public long count() {
    return repository.count();
  }

  @Transactional
  public ElectoralDivision save(ElectoralDivision electoralDivision) {
    return repository.save(electoralDivision);
  }

}

/*

  public Optional<ElectoralDivision> findByName(final String name) {
    return repository.findByName(name);
  }

*/
