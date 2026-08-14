package org.serendipity.party.repository;

import org.serendipity.party.entity.Role;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface RoleRepository extends JpaRepository<Role, Long> {

  Optional<Role> findByPublicId(String publicId);

  List<Role> findAllByPartyPublicId(String partyPublicId);

  void deleteByPublicId(String publicId);

}
