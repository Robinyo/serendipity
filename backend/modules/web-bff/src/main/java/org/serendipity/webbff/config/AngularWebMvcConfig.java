package org.serendipity.webbff.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.core.io.ClassPathResource;
import org.springframework.core.io.Resource;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;
import org.springframework.web.servlet.resource.PathResourceResolver;

import java.io.IOException;

@Configuration
public class AngularWebMvcConfig implements WebMvcConfigurer {

  @Override
  public void addResourceHandlers(ResourceHandlerRegistry registry) {
    registry.addResourceHandler("/**")
      .addResourceLocations("classpath:/static/")
      .resourceChain(true)
      .addResolver(new PathResourceResolver() {
        @Override
        protected Resource getResource(String resourcePath, Resource location) throws IOException {
          Resource requestedResource = location.createRelative(resourcePath);

          // If the file exists (like main.js, styles.css, images), serve it
          if (requestedResource.exists() && requestedResource.isReadable()) {
            return requestedResource;
          }

          // If it's a backend API route, ignore it so the Gateway can route it
          if (resourcePath.startsWith("api/") || resourcePath.startsWith("v2/")) {
            return null;
          }

          // For everything else (like /dashboard, /profile), serve index.html
          return new ClassPathResource("/static/index.html");
        }
      });
  }
}
