package org.serendipity.webbff.config;

import lombok.extern.slf4j.Slf4j;
import org.apache.tomcat.util.http.Rfc6265CookieProcessor;
import org.apache.tomcat.util.http.SameSiteCookies;
import org.springframework.boot.web.embedded.tomcat.TomcatContextCustomizer;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

// @EnableWebMvc
@Configuration
@Slf4j
public class WebMvcConfig implements WebMvcConfigurer {

  /*

  2021-10-14 20:29:40.719  WARN 1 --- [nio-8080-exec-1] o.s.web.servlet.PageNotFound  : No mapping for GET /
  2021-10-14 20:29:40.950  WARN 1 --- [nio-8080-exec-2] o.s.web.servlet.PageNotFound  : No mapping for GET /favicon.ico

  @Override
  public void addCorsMappings(CorsRegistry registry) {

    log.info("WebMvcConfig -> addCorsMappings()");

    registry.addMapping("/**");

  }

  */

  @Bean
  public TomcatContextCustomizer sameSiteCookiesConfig() {

    log.info("WebMvcConfig -> sameSiteCookiesConfig()");

    return context -> {
      final Rfc6265CookieProcessor cookieProcessor = new Rfc6265CookieProcessor();
      cookieProcessor.setSameSiteCookies(SameSiteCookies.STRICT.getValue());
      context.setCookieProcessor(cookieProcessor);
    };

  }

}

// https://stackoverflow.com/questions/24916894/serving-static-web-resources-in-spring-boot-spring-security-application

// https://stackoverflow.com/questions/38516667/springboot-angular2-how-to-handle-html5-urls/46854105#46854105

// https://stackoverflow.com/questions/42998367/same-site-flag-for-session-cookie-in-spring-security/60860531#60860531
