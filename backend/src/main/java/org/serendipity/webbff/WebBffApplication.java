package org.serendipity.webbff;

import lombok.extern.slf4j.Slf4j;
import org.serendipity.webbff.service.WebClientFilter;
import org.serendipity.webbff.utils.AuthConstants;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.web.servlet.error.ErrorController;
import org.springframework.context.annotation.Bean;
import org.springframework.http.HttpStatus;
import org.springframework.http.client.reactive.ReactorClientHttpConnector;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.reactive.function.client.WebClient;
import reactor.netty.http.client.HttpClient;

import java.time.Duration;

@Controller
@SpringBootApplication
@Slf4j
public class WebBffApplication implements ErrorController {

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

	@RequestMapping("/error")
	@ResponseStatus(HttpStatus.OK)
	public String error() {
		return "redirect:/index.html";
	}

}
