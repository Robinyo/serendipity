package org.serendipity.webbff.config;

import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.autoconfigure.security.servlet.PathRequest;
import org.springframework.context.annotation.Profile;
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
      .antMatchers("/assets/**", "/*.woff", "/*.woff2").permitAll()
      .antMatchers("/*.map").permitAll()
      .antMatchers("/bff/**").permitAll()
      .anyRequest().authenticated()
      .and().oauth2Login()
        .defaultSuccessUrl("/bff/login/success")
        .failureUrl("/bff/login/failure")
      .and().csrf().disable();

  }

}

// https://docs.spring.io/spring-security/site/docs/5.2.12.RELEASE/reference/html/protection-against-exploits.html

// http://127.0.0.1:8080

// https://stackoverflow.com/questions/24916894/serving-static-web-resources-in-spring-boot-spring-security-application

// Overriding Spring Boot 2.x Auto-configuration
// https://docs.spring.io/spring-security/site/docs/5.2.12.RELEASE/reference/html/oauth2.html#oauth2login-override-boot-autoconfig

  /*

  @Bean
  CorsConfigurationSource corsConfigurationSource() {

    log.info("WebSecurityConfig: corsConfigurationSource()");

    CorsConfiguration configuration = new CorsConfiguration();

    // configuration.applyPermitDefaultValues();
    configuration.setAllowedOrigins(Collections.singletonList("*"));
    configuration.setAllowedMethods(Arrays.asList("POST", "GET", "PATCH", "PUT", "DELETE"));
    configuration.setAllowCredentials(true);

    UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
    source.registerCorsConfiguration("/**", configuration);

    return source;
  }

  */

/*

    http.authorizeRequests()
      .requestMatchers(PathRequest.toStaticResources().atCommonLocations()).permitAll()
      .antMatchers("/index.html", "/", "/*.js", "/*.css").permitAll()
      .antMatchers("/assets/**", "/*.woff", "/*.woff2").permitAll()
      .antMatchers("/*.map").permitAll()
      .antMatchers("/bff/**").permitAll()
      .anyRequest().authenticated()
      .and().csrf(csrf ->
        csrf
          .csrfTokenRepository(CookieCsrfTokenRepository.withHttpOnlyFalse())
      );

*/

/*

  @Override
  protected void configure(HttpSecurity http) throws Exception {

    log.info("WebSecurityConfig -> configure()");

    // http.cors().and()
    // http.authorizeRequests()

    http.authorizeRequests()
      .requestMatchers(PathRequest.toStaticResources().atCommonLocations()).permitAll()
      .antMatchers("/index.html", "/", "/*.js", "/*.css").permitAll()
      .antMatchers("/assets/**", "/*.woff", "/*.woff2").permitAll()
      .antMatchers("/*.map").permitAll()
      .antMatchers("/bff/login/**").permitAll()
      .anyRequest().authenticated()
      .and().csrf()                                 // csrf config starts here
      .ignoringAntMatchers(CSRF_IGNORE)             // URI where CSRF check will not be applied
      .csrfTokenRepository(csrfTokenRepository())   // defines a repository where tokens are stored
      .and()
      .addFilterAfter(new CustomCsrfFilter(), CsrfFilter.class); // Csrf filter in which we add the cookie
      // .and().oauth2Client();
      // .and().oauth2Login().defaultSuccessUrl("/login-callback");

  }

  private CsrfTokenRepository csrfTokenRepository() {
    HttpSessionCsrfTokenRepository repository = new HttpSessionCsrfTokenRepository();
    repository.setHeaderName(CustomCsrfFilter.CSRF_COOKIE_NAME);
    return repository;
  }

*/

/*

    // configuration.setAllowedOrigins(Collections.singletonList("http://127.0.0.1:8080"));
    // configuration.setAllowedMethods(Arrays.asList("POST", "GET"));

    http.cors().and()
      .authorizeRequests()
      .requestMatchers(PathRequest.toStaticResources().atCommonLocations()).permitAll()
      .antMatchers("/index.html", "/", "/*.js", "/*.css").permitAll()
      .antMatchers("/assets/**").permitAll()
      .antMatchers("/*.woff").permitAll()
      .antMatchers("/*.woff2").permitAll()
      .antMatchers("/bff/login").permitAll()
      .antMatchers("/*.map").permitAll()
      .anyRequest().authenticated()
      // .and().oauth2Client()
      .and().oauth2Login();








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
