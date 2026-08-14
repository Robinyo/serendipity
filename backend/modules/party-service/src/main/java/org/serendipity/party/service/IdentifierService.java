package org.serendipity.party.service;

import lombok.RequiredArgsConstructor;
import org.serendipity.party.entity.Identifier;
import org.serendipity.party.repository.IdentifierRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class IdentifierService {

  private final IdentifierRepository repository;

  @Transactional
  public Identifier save(Identifier address) {
    return repository.save(address);
  }

}
