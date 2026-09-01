package org.serendipity.webbff.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpStatus;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.oauth2.client.oidc.web.logout.OidcClientInitiatedLogoutSuccessHandler;
import org.springframework.security.oauth2.client.registration.ClientRegistrationRepository;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.HttpStatusEntryPoint;
import org.springframework.security.web.csrf.CookieCsrfTokenRepository;
import org.springframework.security.web.csrf.CsrfTokenRequestAttributeHandler;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;
import org.springframework.web.filter.OncePerRequestFilter;
import org.springframework.web.servlet.function.HandlerFilterFunction;
import org.springframework.web.servlet.function.ServerResponse;

import org.springframework.cloud.gateway.server.mvc.filter.TokenRelayFilterFunctions;

import java.util.List;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.web.filter.OncePerRequestFilter;
import org.springframework.security.web.csrf.CsrfToken;

@Configuration
@EnableWebSecurity
public class SecurityConfig {

  @Bean
  public SecurityFilterChain securityFilterChain(
    HttpSecurity http,
    ClientRegistrationRepository clientRegistrationRepository) throws Exception {

    // ⚡ THE LOGOUT HANDLER: Construct the OpenID Connect standard RP-Initiated logout handler
    OidcClientInitiatedLogoutSuccessHandler oidcLogoutSuccessHandler =
      new OidcClientInitiatedLogoutSuccessHandler(clientRegistrationRepository);

    // Set the final landing location to your public Welcome page once Keycloak destroys the session globally
    oidcLogoutSuccessHandler.setPostLogoutRedirectUri("https://serendipity.localhost/");

    // THE ARCHITECTURAL WORKAROUND:
    // If the OIDC context evaluates to null or anonymous during logout,
    // tell this specific handler object to immediately perform a native fallback redirect to root.
    // This safely keeps the handler active without using the conflicting ".logoutSuccessUrl()" method on the builder!
    oidcLogoutSuccessHandler.setDefaultTargetUrl("https://serendipity.localhost/");

    http
      // 1. MUST BE FIRST: Process CORS headers early in the security chain
      .cors(Customizer.withDefaults())
      .authorizeHttpRequests(auth -> auth
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

        // Redirect back to the secure proxy layout context root post-login
        .defaultSuccessUrl("https://serendipity.localhost/customers/contacts", true)
      )
      .logout(logout -> logout
          .logoutUrl("/logout") // The explicit endpoint your UI button will call

        // Allow standard browser window GET requests to trigger the logout pipeline even with active CSRF token
        // rules enabled!
        .logoutRequestMatcher(request -> "GET".equals(request.getMethod()) && "/logout".equals(request.getRequestURI()))

        // Invalidate resources, dump session maps, and destroy cookies FIRST
        // while preserving the active authentication context token.
        .invalidateHttpSession(true)
        .clearAuthentication(true)
        .deleteCookies("JSESSIONID")

        // This MUST be the final handler directive in this block
        .logoutSuccessHandler(oidcLogoutSuccessHandler)
      )
      .exceptionHandling(exceptions -> exceptions
        .defaultAuthenticationEntryPointFor(
          new HttpStatusEntryPoint(HttpStatus.UNAUTHORIZED),
          request -> request.getRequestURI().startsWith("/api/") || request.getRequestURI().startsWith("/v2/")
        )
      )

      // Add your cookie synchronizer filter right after Basic Authentication rules!
      .addFilterAfter(new CsrfCookieFilter(), org.springframework.security.web.authentication.www.BasicAuthenticationFilter.class)

      .csrf(csrf -> csrf
        .ignoringRequestMatchers("/actuator/**")
        .csrfTokenRepository(CookieCsrfTokenRepository.withHttpOnlyFalse())
        // Use a standard CsrfTokenRequestAttributeHandler instead of the XOR handler.
        // We override the execution handle method to bypass the strict XOR token generation,
        // forcing the gateway to validate the raw, plain UUID header string natively!
        .csrfTokenRequestHandler((request, response, csrfToken) -> {
          CsrfTokenRequestAttributeHandler handler = new CsrfTokenRequestAttributeHandler();

          // Explicitly force the handler to read raw string values instead of deferred XOR blocks
          request.setAttribute(org.springframework.security.web.csrf.CsrfToken.class.getName(), csrfToken);

          handler.handle(request, response, csrfToken);
        })
      );

    return http.build();
  }


  // Define the actual CORS policy bean that Spring Security looks for
  @Bean
  public CorsConfigurationSource corsConfigurationSource() {
    CorsConfiguration configuration = new CorsConfiguration();

    // FIXED: Support both the new direct proxy mapping and port 4200 origins
    configuration.setAllowedOrigins(List.of("https://serendipity.localhost", "http://localhost:4200"));
    configuration.setAllowedMethods(List.of("GET", "POST", "PUT", "DELETE", "OPTIONS"));
    configuration.setAllowedHeaders(List.of("Authorization", "Cache-Control", "Content-Type", "X-XSRF-TOKEN"));

    // Required to allow cookies/sessions to pass smoothly inside the gateway domain
    configuration.setAllowCredentials(true);

    UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
    source.registerCorsConfiguration("/**", configuration);
    return source;
  }

  // This registers TokenRelay globally across all Web MVC gateway routes
  @Bean
  public HandlerFilterFunction<ServerResponse, ServerResponse> globalTokenRelayFilter() {
    return TokenRelayFilterFunctions.tokenRelay();
  }

  private static class CsrfCookieFilter extends OncePerRequestFilter {
    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
      throws ServletException, java.io.IOException {

      // ⚡ THE ARCHITECTURAL SYNCHRONIZER:
      // Force the lazy deferred Spring CsrfToken instance to resolve right now!
      // This ensures the raw XSRF-TOKEN cookie is persistently written to the browser on every request.
      CsrfToken csrfToken = (CsrfToken) request.getAttribute(CsrfToken.class.getName());
      if (csrfToken != null) {
        // Accessing the token string forces Spring to commit the cookie to the HTTP response instantly!
        csrfToken.getToken();
      }

      filterChain.doFilter(request, response);
    }
  }

}



/*

package org.serendipity.webbff.config;

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
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;
import org.springframework.web.servlet.function.HandlerFilterFunction;
import org.springframework.web.servlet.function.ServerResponse;

import org.springframework.cloud.gateway.server.mvc.filter.TokenRelayFilterFunctions;

import java.util.List;

@Configuration
@EnableWebSecurity
public class SecurityConfig {

  @Bean
  public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {

    http
      // 1. MUST BE FIRST: Process CORS headers early in the security chain
      .cors(Customizer.withDefaults())
      .authorizeHttpRequests(auth -> auth
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

        //  FIXED: Redirect back to the secure proxy layout context root post-login
        .defaultSuccessUrl("https://serendipity.localhost/customers/contacts", true)
      )
      .exceptionHandling(exceptions -> exceptions
        .defaultAuthenticationEntryPointFor(
          new HttpStatusEntryPoint(HttpStatus.UNAUTHORIZED),
          request -> request.getRequestURI().startsWith("/api/") || request.getRequestURI().startsWith("/v2/")
        )
      )
      .csrf(csrf -> csrf
        .ignoringRequestMatchers("/actuator/**")
        .csrfTokenRepository(CookieCsrfTokenRepository.withHttpOnlyFalse())
        .csrfTokenRequestHandler(new CsrfTokenRequestAttributeHandler())
      );

    return http.build();
  }

  // Define the actual CORS policy bean that Spring Security looks for
  @Bean
  public CorsConfigurationSource corsConfigurationSource() {
    CorsConfiguration configuration = new CorsConfiguration();

    //  FIXED: Support both the new direct proxy mapping and port 4200 origins
    configuration.setAllowedOrigins(List.of("https://serendipity.localhost", "http://localhost:4200"));
    configuration.setAllowedMethods(List.of("GET", "POST", "PUT", "DELETE", "OPTIONS"));
    configuration.setAllowedHeaders(List.of("Authorization", "Cache-Control", "Content-Type", "X-XSRF-TOKEN"));

    // Required to allow cookies/sessions to pass smoothly inside the gateway domain
    configuration.setAllowCredentials(true);

    UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
    source.registerCorsConfiguration("/**", configuration);
    return source;
  }

  // This registers TokenRelay globally across all Web MVC gateway routes
  @Bean
  public HandlerFilterFunction<ServerResponse, ServerResponse> globalTokenRelayFilter() {
    return TokenRelayFilterFunctions.tokenRelay();
  }

}

*/

/*

package org.serendipity.webbff.config;

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
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;
import org.springframework.web.servlet.function.HandlerFilterFunction;
import org.springframework.web.servlet.function.ServerResponse;

import org.springframework.cloud.gateway.server.mvc.filter.TokenRelayFilterFunctions;

import java.util.List;

@Configuration
@EnableWebSecurity
public class SecurityConfig {

  @Bean
  public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
    http
      // 1. MUST BE FIRST: Process CORS headers early in the security chain
      .cors(Customizer.withDefaults())
      .authorizeHttpRequests(auth -> auth
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
        .defaultSuccessUrl("https://serendipity.localhost", true)
      )
      .exceptionHandling(exceptions -> exceptions
        .defaultAuthenticationEntryPointFor(
          new HttpStatusEntryPoint(HttpStatus.UNAUTHORIZED),
          request -> request.getRequestURI().startsWith("/api/") || request.getRequestURI().startsWith("/v2/")
        )
      )
      .csrf(csrf -> csrf
        .ignoringRequestMatchers("/actuator/**")
        .csrfTokenRepository(CookieCsrfTokenRepository.withHttpOnlyFalse())
        .csrfTokenRequestHandler(new CsrfTokenRequestAttributeHandler())
      );

    return http.build();
  }

  // Define the actual CORS policy bean that Spring Security looks for
  @Bean
  public CorsConfigurationSource corsConfigurationSource() {
    CorsConfiguration configuration = new CorsConfiguration();
    // Explicitly allow your Angular Dev Server origin
    configuration.setAllowedOrigins(List.of("https://serendipity.localhost", "http://localhost:4200"));
    configuration.setAllowedMethods(List.of("GET", "POST", "PUT", "DELETE", "OPTIONS"));
    configuration.setAllowedHeaders(List.of("Authorization", "Cache-Control", "Content-Type", "X-XSRF-TOKEN"));
    // Required to allow cookies/sessions to pass between localhost:4200 and serendipity.localhost
    configuration.setAllowCredentials(true);

    UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
    source.registerCorsConfiguration("/**", configuration);
    return source;
  }

  // This registers TokenRelay globally across all Web MVC gateway routes
  @Bean
  public HandlerFilterFunction<ServerResponse, ServerResponse> globalTokenRelayFilter() {
    return TokenRelayFilterFunctions.tokenRelay();
  }

}

*/

/*

package org.serendipity.webbff.config;

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
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;
import org.springframework.web.servlet.function.HandlerFilterFunction;
import org.springframework.web.servlet.function.ServerResponse;
import org.springframework.cloud.gateway.server.mvc.filter.TokenRelayFilterFunctions;

import java.util.List;

@Configuration
@EnableWebSecurity
public class SecurityConfig {

  @Bean
  public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {

    // Instantiate a customised CSRF repository that permits cross-domain injection
    CookieCsrfTokenRepository tokenRepository = CookieCsrfTokenRepository.withHttpOnlyFalse();
    tokenRepository.setCookieCustomizer(cookie -> cookie
      .sameSite("None")     // Allow cookie distribution across port 4200 origins
      .secure(true)         // Enforce secure TLS wrapping (Required for SameSite=None)
      .path("/")
    );

    http
      .cors(Customizer.withDefaults())
      .authorizeHttpRequests(auth -> auth
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
        // Update success URL target destination to point directly to your HTTPS DevServer
        .defaultSuccessUrl("https://localhost:4200/", true)
      )
      .exceptionHandling(exceptions -> exceptions
        .defaultAuthenticationEntryPointFor(
          new HttpStatusEntryPoint(HttpStatus.UNAUTHORIZED),
          request -> request.getRequestURI().startsWith("/api/") || request.getRequestURI().startsWith("/v2/")
        )
      )
      .csrf(csrf -> csrf
        .ignoringRequestMatchers("/actuator/**")
        .csrfTokenRepository(tokenRepository) // Use the updated repository configuration instance
        .csrfTokenRequestHandler(new CsrfTokenRequestAttributeHandler())
      );

    return http.build();
  }

  @Bean
  public CorsConfigurationSource corsConfigurationSource() {
    CorsConfiguration configuration = new CorsConfiguration();
    // Update origin destination parameter to match your secure local server instance
    configuration.setAllowedOrigins(List.of("https://localhost:4200"));
    configuration.setAllowedMethods(List.of("GET", "POST", "PUT", "DELETE", "OPTIONS"));
    configuration.setAllowedHeaders(List.of("Authorization", "Cache-Control", "Content-Type", "X-XSRF-TOKEN"));
    configuration.setAllowCredentials(true);

    UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
    source.registerCorsConfiguration("/**", configuration);
    return source;
  }

  @Bean
  public HandlerFilterFunction<ServerResponse, ServerResponse> globalTokenRelayFilter() {
    return TokenRelayFilterFunctions.tokenRelay();
  }
}

*/

/*

package org.serendipity.webbff.config;

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
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;
import org.springframework.web.servlet.function.HandlerFilterFunction;
import org.springframework.web.servlet.function.ServerResponse;

import org.springframework.cloud.gateway.server.mvc.filter.TokenRelayFilterFunctions;

import java.util.List;

@Configuration
@EnableWebSecurity
public class SecurityConfig {

  @Bean
  public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
    http
      // 1. MUST BE FIRST: Process CORS headers early in the security chain
      .cors(Customizer.withDefaults())
      .authorizeHttpRequests(auth -> auth
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

        //
        // Force a redirect to the local dev server post-login
        //

        .defaultSuccessUrl("http://localhost:4200/", true)

      )
      .exceptionHandling(exceptions -> exceptions
        .defaultAuthenticationEntryPointFor(
          new HttpStatusEntryPoint(HttpStatus.UNAUTHORIZED),
          request -> request.getRequestURI().startsWith("/api/") || request.getRequestURI().startsWith("/v2/")
        )
      )
      .csrf(csrf -> csrf
        .ignoringRequestMatchers("/actuator/**")
        .csrfTokenRepository(CookieCsrfTokenRepository.withHttpOnlyFalse())
        .csrfTokenRequestHandler(new CsrfTokenRequestAttributeHandler())
      );

    return http.build();
  }

  // Define the actual CORS policy bean that Spring Security looks for
  @Bean
  public CorsConfigurationSource corsConfigurationSource() {
    CorsConfiguration configuration = new CorsConfiguration();
    // Explicitly allow your Angular Dev Server origin
    configuration.setAllowedOrigins(List.of("http://localhost:4200"));
    configuration.setAllowedMethods(List.of("GET", "POST", "PUT", "DELETE", "OPTIONS"));
    configuration.setAllowedHeaders(List.of("Authorization", "Cache-Control", "Content-Type", "X-XSRF-TOKEN"));
    // Required to allow cookies/sessions to pass between localhost:4200 and serendipity.localhost
    configuration.setAllowCredentials(true);

    UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
    source.registerCorsConfiguration("/**", configuration);
    return source;
  }

  // This registers TokenRelay globally across all Web MVC gateway routes
  @Bean
  public HandlerFilterFunction<ServerResponse, ServerResponse> globalTokenRelayFilter() {
    return TokenRelayFilterFunctions.tokenRelay();
  }

}

*/
