package org.serendipity.webbff;

import lombok.extern.slf4j.Slf4j;
import org.serendipity.webbff.service.WebClientFilter;
import org.serendipity.webbff.utils.AuthConstants;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;
import org.springframework.http.client.reactive.ReactorClientHttpConnector;
import org.springframework.web.reactive.function.client.WebClient;
import reactor.netty.http.client.HttpClient;

import java.time.Duration;

@SpringBootApplication
@Slf4j
public class WebBffApplication {

	@Bean
	public WebClient getWebClient() {

		log.info("RelyingPartySampleApplication -> getWebClient()");

		HttpClient httpClient = HttpClient.create().responseTimeout(Duration.ofMillis(AuthConstants.TIMEOUT));

		return WebClient.builder()
			// .baseUrl(AuthConstants.BASE_URL)
			.filter(WebClientFilter.logRequest())
			.filter(WebClientFilter.logResponse())
			.clientConnector(new ReactorClientHttpConnector(httpClient))
			.build();
	}

	public static void main(String[] args) {

		log.info("Web BFF Application -> main()");

		SpringApplication.run(WebBffApplication.class, args);
	}

}
