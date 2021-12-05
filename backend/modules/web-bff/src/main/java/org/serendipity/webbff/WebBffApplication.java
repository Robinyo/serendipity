package org.serendipity.webbff;

import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
@Slf4j
public class WebBffApplication {

	public static void main(String[] args) {

		log.info("Web BFF Application -> main()");

		SpringApplication.run(WebBffApplication.class, args);
	}

}
