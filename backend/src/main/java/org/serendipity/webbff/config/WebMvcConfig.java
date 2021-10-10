package org.serendipity.webbff.config;

import java.io.IOException;

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
public class WebMvcConfig implements WebMvcConfigurer {

  @Override
  public void addResourceHandlers(ResourceHandlerRegistry registry) {

    registry.addResourceHandler("/**/*")
      .addResourceLocations("classpath:/static/")
      .resourceChain(true)
      .addResolver(new PathResourceResolver() {
        @Override
        protected Resource getResource(String resourcePath,
                                       Resource location) throws IOException {
          Resource requestedResource = location.createRelative(resourcePath);
          return requestedResource.exists() && requestedResource.isReadable() ? requestedResource
            : new ClassPathResource("/static/index.html");
        }
      });

  }

  @Bean
  public TomcatContextCustomizer sameSiteCookiesConfig() {

    return context -> {
      final Rfc6265CookieProcessor cookieProcessor = new Rfc6265CookieProcessor();
      cookieProcessor.setSameSiteCookies(SameSiteCookies.STRICT.getValue());
      context.setCookieProcessor(cookieProcessor);
    };

  }

}

// https://stackoverflow.com/questions/38516667/springboot-angular2-how-to-handle-html5-urls/46854105#46854105

// https://stackoverflow.com/questions/42998367/same-site-flag-for-session-cookie-in-spring-security/60860531#60860531
