package org.serendipity.party.database.seed.au;

import lombok.extern.slf4j.Slf4j;
import org.serendipity.party.entity.ElectoralDivision;
import org.serendipity.party.repository.ElectoralDivisionRepository;
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
  private ElectoralDivisionRepository electoralDivisionRepository;

  @Override
  @Transactional
  public void run(String... args) throws Exception {

    log.info("Create Electoral Divisions ...");

    BufferedReader buffer = null;

    try {

      //
      // Process sample data file
      //

      InputStream resource = new ClassPathResource(PATH).getInputStream();

      buffer = new BufferedReader(new InputStreamReader(resource));

      String line = buffer.readLine();

      // log.info("Header: {}", line);

      while ((line = buffer.readLine()) != null && !line.isEmpty()) {

        // Note: No support for strings with embedded commas
        String[] fields = line.split(",");

        // 20 July 2018
        // SimpleDateFormat formatter = new SimpleDateFormat("dd MMM yyyy", Locale.ENGLISH);

        ElectoralDivision electoralDivision = ElectoralDivision.builder()
          .name(fields[NAME])
          // .state(fields[STATE])
          // .area(fields[AREA])
          // .dateGazetted(formatter.parse(fields[DATE_GAZETTED]))
          .latitude(fields[LATITUDE])
          .longitude(fields[LONGITUDE])
          .build();

        electoralDivisionRepository.save(electoralDivision);

      }

      log.info("Create Electoral Divisions complete");

    } catch (Exception e) {

      log.error("{}", e.getLocalizedMessage());

    } finally {

      if (buffer != null) {
        buffer.close();
      }

    }

  }

}

// https://www.aec.gov.au/profiles/

// https://en.wikipedia.org/wiki/Divisions_of_the_Australian_House_of_Representatives

// http://psephos.adam-carr.net/


