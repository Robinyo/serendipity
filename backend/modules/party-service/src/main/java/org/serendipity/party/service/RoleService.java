package org.serendipity.party.service;

import org.serendipity.party.entity.Role;
import org.serendipity.party.repository.RoleRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

@Service
public class RoleService {

  private final RoleRepository repository;

  public RoleService(RoleRepository repository) {
    this.repository = repository;
  }

  public Page<Role> findByPartyId(Long partyId, Pageable pageable) {
    return repository.findByPartyId(partyId, pageable);
  }

  public Role findById(Long id) throws ResponseStatusException {
    return repository.findById(id).orElseThrow(() ->
        new ResponseStatusException(HttpStatus.NOT_FOUND));
  }

  public Role save(Role role) {
    return repository.save(role);
  }

  public void delete(Role role) {
    repository.delete(role);
  }

}
