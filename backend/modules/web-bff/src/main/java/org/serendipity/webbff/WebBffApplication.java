package org.serendipity.webbff;

import lombok.extern.slf4j.Slf4j;
import org.jspecify.annotations.NonNull;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@SpringBootApplication
@Slf4j
public class WebBffApplication {

  // @Value("${serendipity-bff.uri}")
  @Value("${serendipity-web-bff.uri:https://serendipity.localhost}")
  private String serendipityBffUri;

  public static void main(String[] args) {

    log.info("BFF Service -> main()");

    SpringApplication.run(WebBffApplication.class, args);

  }

  @Bean
  public WebMvcConfigurer corsConfigurer() {
    return new WebMvcConfigurer() {
      @Override
      public void addCorsMappings(@NonNull CorsRegistry registry) {
        registry.addMapping("/**")
          .allowedOrigins(
            "http://localhost:4200",
            serendipityBffUri
          )
          .allowedMethods("GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS")
          .allowedHeaders("*")
          .allowCredentials(true);
      }
    };
  }

}



/*

package org.serendipity.webbff;

import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@SpringBootApplication
@Slf4j
public class WebBffApplication {

  // @Value("${serendipity-bff.uri}")
  @Value("${serendipity-web-bff.uri:https://serendipity.localhost}")
  private String serendipityBffUri;

	public static void main(String[] args) {

    log.info("BFF Service -> main()");

    SpringApplication.run(WebBffApplication.class, args);

	}

  @Bean
  public WebMvcConfigurer corsConfigurer() {
    return new WebMvcConfigurer() {
      @Override
      public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/**")
          .allowedOrigins(
            "http://localhost:4200",
            serendipityBffUri
          )
          .allowedMethods("GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS")
          .allowedHeaders("*")
          .allowCredentials(true);
      }
    };
  }

}

*/
