package org.serendipity.webbff.config;

import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.boot.context.properties.EnableConfigurationProperties;
import org.springframework.boot.security.oauth2.client.autoconfigure.OAuth2ClientProperties;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpStatus;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.oauth2.client.registration.ClientRegistration;
import org.springframework.security.oauth2.core.AuthorizationGrantType;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.HttpStatusEntryPoint;
import org.springframework.security.web.csrf.CookieCsrfTokenRepository;
import org.springframework.security.web.csrf.CsrfTokenRequestAttributeHandler;

import org.springframework.boot.autoconfigure.condition.ConditionalOnMissingBean;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.oauth2.client.registration.ClientRegistrationRepository;
import org.springframework.security.oauth2.client.registration.InMemoryClientRegistrationRepository;

@Configuration
@EnableWebSecurity
@EnableConfigurationProperties(OAuth2ClientProperties.class)
@ConditionalOnProperty(name = "serendipity-web-bff.auth.enabled", havingValue = "true")
public class OAuth2BffSecurityConfig {

  @Bean
  public SecurityFilterChain prodSecurityFilterChain(HttpSecurity http) throws Exception {
    CsrfTokenRequestAttributeHandler requestHandler = new CsrfTokenRequestAttributeHandler();
    requestHandler.setCsrfRequestAttributeName(null); // Deferred CSRF for SPAs

    return http
      .cors(Customizer.withDefaults())
      .csrf(csrf -> csrf
        .csrfTokenRepository(CookieCsrfTokenRepository.withHttpOnlyFalse())
        .csrfTokenRequestHandler(requestHandler)
      )
      .exceptionHandling(exceptions -> exceptions
        .defaultAuthenticationEntryPointFor(
          new HttpStatusEntryPoint(HttpStatus.UNAUTHORIZED),
          request -> request.getHeader("X-Requested-With") != null || request.getHeader("Accept") != null
        )
      )
      .authorizeHttpRequests(auth -> auth
        .requestMatchers("/api/config", "/error", "/actuator/**").permitAll()
        .anyRequest().authenticated()
      )
      .oauth2Login(Customizer.withDefaults())
      .build();
  }

  // There is an established framework caveat here: Spring Cloud Gateway MVC contains a known auto-configuration
  // order issue where the TokenRelay filter throws an exception during startup if it evaluates before Spring Security
  // exposes the ClientRegistrationRepository.

  @Bean
  @ConditionalOnMissingBean(ClientRegistrationRepository.class)
  public ClientRegistrationRepository fallbackClientRegistrationRepository() {
    // Fix: Provide a dummy configuration registration stub to prevent the "cannot be empty" crash
    ClientRegistration dummyRegistration = ClientRegistration.withRegistrationId("fallback")
      .clientId("fallback")
      .authorizationGrantType(AuthorizationGrantType.AUTHORIZATION_CODE)
      .redirectUri("{baseUrl}/fallback")
      .authorizationUri("http://localhost")
      .tokenUri("http://localhost")
      .build();

    return new InMemoryClientRegistrationRepository(dummyRegistration);
  }

}

/*

  @Bean
  @ConditionalOnMissingBean(ClientRegistrationRepository.class)
  public ClientRegistrationRepository fallbackClientRegistrationRepository() {
    // Returns an empty fallback repository container to prevent startup crashes
    // if TokenRelay triggers before OAuth properties fully bind.
    return new InMemoryClientRegistrationRepository();
  }

*/

/*

package org.serendipity.webbff.config;

import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.boot.security.oauth2.client.autoconfigure.OAuth2ClientProperties;
import org.springframework.boot.security.oauth2.client.autoconfigure.OAuth2ClientPropertiesMapper;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpStatus;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.oauth2.client.registration.ClientRegistration;
import org.springframework.security.oauth2.client.registration.ClientRegistrationRepository;
import org.springframework.security.oauth2.client.registration.InMemoryClientRegistrationRepository;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.HttpStatusEntryPoint;
import org.springframework.security.web.csrf.CookieCsrfTokenRepository;
import org.springframework.security.web.csrf.CsrfTokenRequestAttributeHandler;

import java.util.ArrayList;
import java.util.List;

@Configuration
@EnableWebSecurity
@ConditionalOnProperty(name = "serendipity-web-bff.auth.enabled", havingValue = "true")
public class OAuth2BffSecurityConfig {

  @Bean
  public ClientRegistrationRepository clientRegistrationRepository(OAuth2ClientProperties properties) {
    List<ClientRegistration> registrations = new ArrayList<>(
      new OAuth2ClientPropertiesMapper(properties).asClientRegistrations().values()
    );
    return new InMemoryClientRegistrationRepository(registrations);
  }

  @Bean
  public SecurityFilterChain prodSecurityFilterChain(HttpSecurity http) throws Exception {
    CsrfTokenRequestAttributeHandler requestHandler = new CsrfTokenRequestAttributeHandler();
    requestHandler.setCsrfRequestAttributeName(null);

    return http
      .cors(Customizer.withDefaults())
      .csrf(csrf -> csrf
        .csrfTokenRepository(CookieCsrfTokenRepository.withHttpOnlyFalse())
        .csrfTokenRequestHandler(requestHandler)
      )
      .exceptionHandling(exceptions -> exceptions
        .defaultAuthenticationEntryPointFor(
          new HttpStatusEntryPoint(HttpStatus.UNAUTHORIZED),
          request -> request.getHeader("X-Requested-With") != null || request.getHeader("Accept") != null
        )
      )
      .authorizeHttpRequests(auth -> auth
        .requestMatchers("/api/config", "/error", "/actuator/**").permitAll()
        .anyRequest().authenticated()
      )
      .oauth2Login(Customizer.withDefaults())
      .build();
  }

}

*/

/*

@Configuration
@EnableWebSecurity
@ConditionalOnProperty(name = "serendipity-web-bff.auth.enabled", havingValue = "true")
public class OAuth2BffSecurityConfig {

  @Bean
  public SecurityFilterChain prodSecurityFilterChain(
    HttpSecurity http,
    ClientRegistrationRepository clientRegistrationRepository) throws Exception {

    CsrfTokenRequestAttributeHandler requestHandler = new CsrfTokenRequestAttributeHandler();
    requestHandler.setCsrfRequestAttributeName(null);

    return http
      .cors(Customizer.withDefaults())
      .csrf(csrf -> csrf
        .csrfTokenRepository(CookieCsrfTokenRepository.withHttpOnlyFalse())
        .csrfTokenRequestHandler(requestHandler)
      )
      .exceptionHandling(exceptions -> exceptions
        .defaultAuthenticationEntryPointFor(
          new HttpStatusEntryPoint(HttpStatus.UNAUTHORIZED),
          request -> request.getHeader("X-Requested-With") != null || request.getHeader("Accept") != null
        )
      )
      .authorizeHttpRequests(auth -> auth
        .requestMatchers("/api/config", "/error", "/actuator/**").permitAll()
        .anyRequest().authenticated()
      )
      .oauth2Login(oauth2 -> oauth2
        .clientRegistrationRepository(clientRegistrationRepository)
      )
      .build();
  }
}

*/

/*

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


*/