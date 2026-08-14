package org.serendipity.party.database.seed.au;

import lombok.extern.slf4j.Slf4j;
import org.jspecify.annotations.NonNull;
import org.serendipity.party.entity.Address;
import org.serendipity.party.entity.Location;
import org.serendipity.party.service.AddressService;
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
  private AddressService addressService;

  @Override
  @Transactional
  public void run(String @NonNull ... args) throws Exception {

    // Idempotency check: Skip if already loaded
    if (addressService.existsByName("The Senate")) {
      log.info("Parliament House address already loaded. Skipping...");
      return;
    }

    log.info("Load Parliament House address ...");

    try {
      Location location = Location.builder()
        .type(LocationType.ADDRESS)
        .displayName("PO Box 6100 Parliament House Canberra ACT 2600")
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

      addressService.save(parliamentHouse);

      log.info("Load Parliament House address complete");

    } catch (Exception e) {
      log.error("Failed to load Parliament House address: {}", e.getLocalizedMessage(), e);
      throw e;
    }
  }

}