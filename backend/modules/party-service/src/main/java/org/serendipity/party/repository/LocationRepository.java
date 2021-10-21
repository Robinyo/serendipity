package org.serendipity.party.repository;

import org.serendipity.party.entity.Location;
import org.springframework.data.repository.PagingAndSortingRepository;

public interface LocationRepository extends PagingAndSortingRepository<Location, Long> {

}
