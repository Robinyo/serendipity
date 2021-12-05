package org.serendipity.party;

import lombok.extern.slf4j.Slf4j;

import org.serendipity.party.config.AuditorAwareConfig;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;
import org.springframework.data.jpa.repository.config.EnableJpaAuditing;
import org.springframework.hateoas.server.core.EvoInflectorLinkRelationProvider;

@EnableJpaAuditing(auditorAwareRef = "auditorProvider")
@SpringBootApplication(proxyBeanMethods = false)
@Slf4j
public class PartyServiceApplication {

	@Bean
	public AuditorAwareConfig auditorProvider() {
		return new AuditorAwareConfig();
	}

	// Format embedded collections by pluralising the resource's type

	@Bean
	EvoInflectorLinkRelationProvider relProvider() {
		return new EvoInflectorLinkRelationProvider();
	}

	public static void main(String[] args) {

		log.info("Party Service -> main()");

		SpringApplication.run(PartyServiceApplication.class, args);

	}

}
