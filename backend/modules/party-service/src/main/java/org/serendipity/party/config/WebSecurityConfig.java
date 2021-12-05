package org.serendipity.party.config;

import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.autoconfigure.security.servlet.PathRequest;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Profile;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configuration.WebSecurityConfigurerAdapter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.Arrays;
import java.util.Collections;

@EnableWebSecurity
@Profile({"dev", "test", "prod"})
@Slf4j
public class WebSecurityConfig extends WebSecurityConfigurerAdapter {

  @Override
  protected void configure(HttpSecurity http) throws Exception {

    log.info("WebSecurityConfig: configure()");

    http.cors().and().authorizeRequests()
      .requestMatchers(PathRequest.toStaticResources().atCommonLocations()).permitAll()
      .antMatchers("/api/**").permitAll()
      .anyRequest().authenticated()
      .and().csrf().disable();
  }

  @Bean
  CorsConfigurationSource corsConfigurationSource() {

    log.info("WebSecurityConfig: corsConfigurationSource()");

    CorsConfiguration configuration = new CorsConfiguration();

    configuration.applyPermitDefaultValues();
    // configuration.setAllowedOrigins(Arrays.asList("https://127.0.0.1/30001", "http://127.0.0.1/30001"));
    configuration.setAllowedOrigins(Collections.singletonList("*"));
    configuration.setAllowedMethods(Arrays.asList("OPTIONS", "POST", "GET", "PATCH", "DELETE"));

    UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
    source.registerCorsConfiguration("/**", configuration);

    return source;
  }

}
