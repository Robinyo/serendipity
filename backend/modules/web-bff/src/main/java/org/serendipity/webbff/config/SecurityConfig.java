package org.serendipity.webbff.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.cloud.gateway.server.mvc.filter.TokenRelayFilterFunctions;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.web.servlet.function.HandlerFilterFunction;
import org.springframework.web.servlet.function.ServerResponse;

import org.springframework.http.HttpStatus;
import org.springframework.security.web.authentication.HttpStatusEntryPoint;

@Configuration
@EnableWebSecurity
public class SecurityConfig {

  @Bean
  public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
    http
      .authorizeHttpRequests(auth -> auth
        // Allow static files to load anonymously
        .requestMatchers(
          "/",
          "/index.html",
          "/*.js",
          "/*.css",
          "/*.ico",
          "/assets/**"
        ).permitAll()
        .requestMatchers("/actuator/**", "/login/**", "/error").permitAll()
        .anyRequest().authenticated()
      )
      .oauth2Login(oauth2 -> oauth2
        .loginPage("/oauth2/authorization/keycloak")
      )
      // If an unauthenticated request targets an API path, return 401 instead of a 302 redirect
      .exceptionHandling(exceptions -> exceptions
        .defaultAuthenticationEntryPointFor(
          new HttpStatusEntryPoint(HttpStatus.UNAUTHORIZED),
          request -> request.getRequestURI().startsWith("/api/") || request.getRequestURI().startsWith("/v2/")
        )
      )
      .csrf(csrf -> csrf.ignoringRequestMatchers("/actuator/**"));

    return http.build();
  }

  /**
   * FIXED: This registers TokenRelay globally across all Web MVC gateway routes
   */
  @Bean
  public HandlerFilterFunction<ServerResponse, ServerResponse> globalTokenRelayFilter() {
    return TokenRelayFilterFunctions.tokenRelay();
  }

}
