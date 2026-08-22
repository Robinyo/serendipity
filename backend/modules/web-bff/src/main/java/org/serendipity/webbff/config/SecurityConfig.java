package org.serendipity.webbff.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.cloud.gateway.server.mvc.filter.TokenRelayFilterFunctions;
import org.springframework.cloud.gateway.server.mvc.handler.GatewayRouterFunctions;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.web.servlet.function.HandlerFilterFunction;
import org.springframework.web.servlet.function.ServerResponse;

@Configuration
@EnableWebSecurity
public class SecurityConfig {

  @Bean
  public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
    http
      .authorizeHttpRequests(auth -> auth
        // FIXED: Permit access to the root, static assets, and Angular entry points
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
      .oauth2Login(Customizer.withDefaults())
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
