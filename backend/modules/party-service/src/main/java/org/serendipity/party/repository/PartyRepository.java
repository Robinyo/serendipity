package org.serendipity.party.repository;

import org.serendipity.party.entity.Party;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

// @Repository
public interface PartyRepository extends JpaRepository<Party, Long> {

  Optional<Party> findByPublicId(String publicId);

  // List<Party> findAllByPublicId(String publicId);

}
