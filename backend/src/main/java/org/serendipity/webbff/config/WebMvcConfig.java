package org.serendipity.webbff.config;

import java.io.IOException;

import lombok.extern.slf4j.Slf4j;
import org.apache.tomcat.util.http.Rfc6265CookieProcessor;
import org.apache.tomcat.util.http.SameSiteCookies;
import org.springframework.boot.web.embedded.tomcat.TomcatContextCustomizer;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.io.ClassPathResource;
import org.springframework.core.io.Resource;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;
import org.springframework.web.servlet.resource.PathResourceResolver;

@Configuration
@Slf4j
public class WebMvcConfig implements WebMvcConfigurer {

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

// https://stackoverflow.com/questions/38516667/springboot-angular2-how-to-handle-html5-urls/46854105#46854105

// https://stackoverflow.com/questions/42998367/same-site-flag-for-session-cookie-in-spring-security/60860531#60860531
