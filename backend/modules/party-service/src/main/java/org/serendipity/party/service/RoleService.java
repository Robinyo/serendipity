package org.serendipity.party.service;

import lombok.RequiredArgsConstructor;
import org.serendipity.party.entity.Role;
import org.serendipity.party.exception.ResourceNotFoundException;
import org.serendipity.party.repository.RoleRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class RoleService {

  private final RoleRepository repository;

  @Transactional(readOnly = true)
  public Page<Role> findAll(Pageable pageable) {
    return repository.findAll(pageable);
  }

  @Transactional(readOnly = true)
  public Role findByPublicId(String publicId) {
    return repository.findByPublicId(publicId)
      .orElseThrow(() -> new ResourceNotFoundException("Role not found with id: " + publicId));
  }

  @Transactional(readOnly = true)
  public List<Role> findAllByPartyPublicId(String partyPublicId) {
    return repository.findAllByPartyPublicId(partyPublicId);
  }

  @Transactional
  public Role save(Role role) {
    return repository.save(role);
  }

  @Transactional
  public void deleteByPublicId(final String publicId) {
    repository.deleteByPublicId(publicId);
  }

}

// How Spring Handles ResponseStatusException
// Spring's default mechanisms (specifically the ResponseStatusExceptionResolver) are designed to automatically
// process ResponseStatusException instances and translate them into appropriate HTTP responses with the correct
// status code and message.
// If you throw a ResponseStatusException in your controller or service layer, Spring will automatically use its
// properties to return a proper error response.


// @Transactional(readOnly = true)
// public Page<Role> findAll(Pageable pageable) {
//   return repository.findAll(pageable);
// }

/*


  public Page findByPublicId(final String publicId, Pageable pageable) {
    return repository.findByPublicId(publicId);
  }

  // public Role findById(final String id) throws ResponseStatusException {
  //   return repository.findById(id).orElseThrow(() ->
  //       new ResponseStatusException(HttpStatus.NOT_FOUND));
  // }

  public Role save(Role role) {
    return repository.save(role);
  }

  public void delete(Role role) {
    repository.delete(role);
  }

*/
