package org.serendipity.party.repository;

import org.serendipity.party.entity.Role;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.repository.PagingAndSortingRepository;

public interface RoleRepository extends PagingAndSortingRepository<Role, Long> {

  Page<Role> findByPartyId(Long partyId, Pageable pageable);

}
