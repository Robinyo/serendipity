package org.serendipity.webbff.config;

import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.autoconfigure.security.servlet.PathRequest;
import org.springframework.context.annotation.Profile;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configuration.WebSecurityConfigurerAdapter;

@EnableWebSecurity
@Profile({"dev", "test", "prod"})
@Slf4j
public class WebSecurityConfig extends WebSecurityConfigurerAdapter {

  @Override
  protected void configure(HttpSecurity http) throws Exception {

    log.info("WebSecurityConfig -> configure()");

    http.authorizeRequests()
      .requestMatchers(PathRequest.toStaticResources().atCommonLocations()).permitAll()
      .antMatchers("/index.html", "/", "/*.js", "/*.css").permitAll()
      .antMatchers("/assets/**").permitAll()
      .antMatchers("/*.woff").permitAll()
      .antMatchers("/*.woff2").permitAll()
      .antMatchers("/bff/login").permitAll()
      .antMatchers("/*.map").permitAll()
      .anyRequest().authenticated()
      .and()
      .oauth2Client();

  }

}

// https://stackoverflow.com/questions/24916894/serving-static-web-resources-in-spring-boot-spring-security-application

// Overriding Spring Boot 2.x Auto-configuration
// https://docs.spring.io/spring-security/site/docs/5.2.12.RELEASE/reference/html/oauth2.html#oauth2login-override-boot-autoconfig

/*

  // http.crsf().disabled().authorizeRequests().anyRequest().authenticated().and().oauth2Login().and().oauth2Client();

  @Override
  protected void configure(HttpSecurity http) throws Exception {

    http.authorizeRequests()
      .anyRequest().authenticated()
      .and()
      .oauth2Login();
  }

  @Override
  protected void configure(HttpSecurity http) throws Exception {

    http.authorizeRequests(authorizeRequests ->
        authorizeRequests
          .anyRequest().authenticated()
      )
      .oauth2Login();

  }

*/
