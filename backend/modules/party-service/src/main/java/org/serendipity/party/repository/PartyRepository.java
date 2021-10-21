package org.serendipity.party.repository;

import org.serendipity.party.entity.Party;
import org.springframework.data.repository.PagingAndSortingRepository;

// @Repository
public interface PartyRepository extends PagingAndSortingRepository<Party, Long> {

}
