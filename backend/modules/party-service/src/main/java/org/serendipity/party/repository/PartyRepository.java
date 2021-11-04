package org.serendipity.party.repository;

import org.serendipity.party.entity.Party;
import org.serendipity.party.entity.Role;
import org.springframework.data.repository.PagingAndSortingRepository;

import java.util.Set;

// @Repository
public interface PartyRepository extends PagingAndSortingRepository<Party, Long> {

}
