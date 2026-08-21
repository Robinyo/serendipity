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

/*

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
            // Explicitly allow PATCH along with other standard methods
            .allowedMethods("GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS")
            // If your Angular app passes Auth headers (like Bearer tokens or Cookies),
            // you should also allow headers and credentials:
            .allowedHeaders("*")
            .allowCredentials(true);
      }
    };
  }

  @Bean
  public WebMvcConfigurer corsConfigurer() {
    return new WebMvcConfigurer() {
      @Override
      public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/**").allowedOrigins(
            "http://localhost:4200",
            serendipityBffUri
        );
      }
    };
  }

*/

