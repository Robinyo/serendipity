package org.serendipity.party;

import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
// import org.springframework.context.annotation.Profile;

@SpringBootApplication
// @Profile({"dev", "test", "prod"})
@Slf4j
public class PartyServiceApplication {

	public static void main(String[] args) {

    log.info("Party Service -> main()");

    SpringApplication.run(PartyServiceApplication.class, args);

	}

}
