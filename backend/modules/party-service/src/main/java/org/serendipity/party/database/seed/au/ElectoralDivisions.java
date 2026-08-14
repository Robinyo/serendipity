package org.serendipity.party.database.seed.au;

import lombok.extern.slf4j.Slf4j;
import org.jspecify.annotations.NonNull;
import org.serendipity.party.entity.ElectoralDivision;
import org.serendipity.party.service.ElectoralDivisionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.core.annotation.Order;
import org.springframework.core.io.ClassPathResource;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.io.BufferedReader;
import java.io.InputStream;
import java.io.InputStreamReader;

@Component
@Slf4j
@Order(1)
public class ElectoralDivisions implements CommandLineRunner {

  static final String PATH = "sample-data/electoral-divisions.csv";

  static final int NAME = 0;
  static final int STATE = 1;
  static final int AREA = 2;
  static final int DATE_GAZETTED = 3;
  static final int LATITUDE = 4;
  static final int LONGITUDE = 5;

  @Autowired
  private ElectoralDivisionService electoralDivisionService;

  @Override
  @Transactional
  public void run(String @NonNull ... args) throws Exception {

    // Idempotency Check: Don't reparse CSV if electoral divisions are already seeded
    if (electoralDivisionService.count() > 0) {
      log.info("Electoral Divisions seed data already exists. Skipping...");
      return;
    }

    log.info("Create Electoral Divisions ...");

    try (InputStream resource = new ClassPathResource(PATH).getInputStream();
         BufferedReader buffer = new BufferedReader(new InputStreamReader(resource))) {

      String line = buffer.readLine(); // Skip header line

      while ((line = buffer.readLine()) != null && !line.trim().isEmpty()) {

        String[] fields = line.split(",");

        ElectoralDivision electoralDivision = ElectoralDivision.builder()
          .name(fields[NAME])
          .latitude(fields[LATITUDE])
          .longitude(fields[LONGITUDE])
          .build();

        electoralDivisionService.save(electoralDivision);
      }

      log.info("Create Electoral Divisions complete");

    } catch (Exception e) {
      log.error("Failed to seed electoral divisions: {}", e.getLocalizedMessage(), e);
      throw e; // Ensures transaction rollback
    }
  }

}