package org.serendipity.party.repository;

import org.serendipity.party.entity.Location;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface LocationRepository extends JpaRepository<Location, Long> {

  Optional<Location> findByPublicId(String publicId);

}
