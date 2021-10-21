package org.serendipity.party.database.seed.au;

import lombok.extern.slf4j.Slf4j;
import org.serendipity.party.entity.Address;
import org.serendipity.party.entity.Location;
import org.serendipity.party.repository.AddressRepository;
import org.serendipity.party.type.LocationType;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.core.annotation.Order;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

@Component
@Slf4j
@Order(1)
public class ParliamentHouse implements CommandLineRunner {

  @Autowired
  private AddressRepository addressRepository;

  @Override
  @Transactional
  public void run(String... args) throws Exception {

    log.info("Load Parliament House address ...");

    try {

      //
      // Parliament House Address
      //

      // Timestamp currentTime = new Timestamp(System.currentTimeMillis());

      Location location = Location.builder()
        .type(LocationType.ADDRESS)
        .displayName("PO Box 6100 Parliament House Canberra ACT 2600")
        // .fromDate(currentTime)
        .build();

      Address parliamentHouse = Address.builder()
        .location(location)
        .name("The Senate")
        .line1("PO Box 6100")
        .line2("Parliament House")
        .city("Canberra")
        .state("ACT")
        .postalCode("2600")
        .country("Australia")
        .addressType("Mailing")
        .build();

      addressRepository.save(parliamentHouse);

      log.info("Load Parliament House address complete");

    } catch (NullPointerException e) {

      log.error("{}", e.getLocalizedMessage());
    }

  }

}
