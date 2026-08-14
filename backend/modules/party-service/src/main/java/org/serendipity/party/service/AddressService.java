package org.serendipity.party.service;

import lombok.RequiredArgsConstructor;
import org.serendipity.party.entity.Address;
import org.serendipity.party.entity.ElectoralDivision;
import org.serendipity.party.repository.AddressRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

@Service
@RequiredArgsConstructor
public class AddressService {

  private final AddressRepository repository;

  @Transactional(readOnly = true)
  public boolean existsByName(String name) {
    return repository.existsByName(name);
  }

  @Transactional(readOnly = true)
  public Page<Address> findAll(Pageable pageable) {
    return repository.findAll(pageable);
  }

  @Transactional(readOnly = true)
  public Address findByLocationPublicId(String publicId) throws ResponseStatusException {
    return repository.findByLocationPublicId(publicId)
      .orElseThrow(() -> new ResponseStatusException(
        HttpStatus.NOT_FOUND,
        "Address not found for location publicId: " + publicId
      ));
  }

  @Transactional(readOnly = true)
  public Page<Address> findByName(final String name, Pageable pageable) {
    return repository.findByName(name, pageable);
  }

  @Transactional
  public Address save(Address address) {
    return repository.save(address);
  }

}
