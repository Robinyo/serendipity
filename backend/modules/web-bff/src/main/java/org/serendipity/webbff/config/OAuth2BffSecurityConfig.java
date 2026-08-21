package org.serendipity.webbff.config;

import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpStatus;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.HttpStatusEntryPoint;
import org.springframework.security.web.csrf.CookieCsrfTokenRepository;
import org.springframework.security.web.csrf.CsrfTokenRequestAttributeHandler;

@Configuration
@EnableWebSecurity
@ConditionalOnProperty(name = "serendipity-web-bff.auth.enabled", havingValue = "true")
public class OAuth2BffSecurityConfig {

  @Bean
  public SecurityFilterChain prodSecurityFilterChain(HttpSecurity http) throws Exception {
    CsrfTokenRequestAttributeHandler requestHandler = new CsrfTokenRequestAttributeHandler();
    requestHandler.setCsrfRequestAttributeName(null); // Force Deferred CSRF loading for SPAs

    return http
      .cors(Customizer.withDefaults())
      .csrf(csrf -> csrf
        .csrfTokenRepository(CookieCsrfTokenRepository.withHttpOnlyFalse())
        .csrfTokenRequestHandler(requestHandler)
      )
      .exceptionHandling(exceptions -> exceptions
        // Return 401 instead of redirecting XHR/API calls to login page when unauthenticated
        .defaultAuthenticationEntryPointFor(
          new HttpStatusEntryPoint(HttpStatus.UNAUTHORIZED),
          request -> request.getHeader("X-Requested-With") != null || request.getHeader("Accept") != null
        )
      )
      .authorizeHttpRequests(auth -> auth
        .requestMatchers("/api/config", "/error").permitAll()
        .anyRequest().authenticated()
      )
      .oauth2Login(Customizer.withDefaults())
      .build();
  }
}