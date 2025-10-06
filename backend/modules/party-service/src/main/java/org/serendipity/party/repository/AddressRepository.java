package org.serendipity.party.repository;

import org.serendipity.party.entity.Address;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.repository.CrudRepository;
import org.springframework.data.repository.PagingAndSortingRepository;

public interface AddressRepository extends CrudRepository<Address, Long>, PagingAndSortingRepository<Address, Long> {

  Page<Address> findByName(String name, Pageable pageable);

}

/*

  Page<Address> findByNameAndLine1AndLine2AndCityAndStateAndPostalCodeAndCountryAndAddressType(
    String name,
    String line1,
    String line2,
    String city,
    String state,
    String postalCode,
    String country,
    String addressType);

*/
