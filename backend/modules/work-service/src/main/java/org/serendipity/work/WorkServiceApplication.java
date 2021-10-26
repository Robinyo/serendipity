package org.serendipity.work;

import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication(proxyBeanMethods = false)
@Slf4j
public class WorkServiceApplication {

	public static void main(String[] args) {

		log.info("Work Service -> main()");

		SpringApplication.run(WorkServiceApplication.class, args);

	}

}
