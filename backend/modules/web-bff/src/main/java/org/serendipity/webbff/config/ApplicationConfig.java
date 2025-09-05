package org.serendipity.webbff.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.cloud.gateway.server.mvc.filter.BeforeFilterFunctions;
import org.springframework.cloud.gateway.server.mvc.handler.HandlerFunctions;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.function.RouterFunction;
import org.springframework.web.servlet.function.ServerResponse;

import static org.springframework.cloud.gateway.server.mvc.handler.GatewayRouterFunctions.route;

@Configuration
public class ApplicationConfig {

  @Value("${party-service.uri}")
  private String targetUri;

  @Bean
  public RouterFunction<ServerResponse> getRoute() {

    return route("party-service")
        .GET("/api/party-service/**", HandlerFunctions.http())
        .before(BeforeFilterFunctions.uri(targetUri))
        .build();
  }

}

/*

    return route("party-service")
        .route(
            path("/api/party-service/**"),
            http(targetUri))
        .build();

    return route("party-service")
        .GET("/my-service/**", http()) // Match GET requests to /my-service/** and use http handler
        .before(uri("https://api.example.com/v1")) // Set the target URI for the upstream service
        .build();

*/