package org.serendipity.party.repository;

import org.serendipity.party.entity.Address;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface AddressRepository extends JpaRepository<Address, Long> {

  // Traverse Address -> Location -> publicId
  Optional<Address> findByLocationPublicId(String publicId);

  Page<Address> findByName(String name, Pageable pageable);

  Page<Address> findByNameContainingIgnoreCase(String name, Pageable pageable);

  boolean existsByName(String name);

}

// Or explicitly using an underscore if publicId naming ambiguity arises
// Optional<Address> findByLocation_PublicId(String publicId);