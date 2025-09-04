package org.serendipity.webbff.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.function.RouterFunction;
import org.springframework.web.servlet.function.ServerResponse;

import static org.springframework.cloud.gateway.server.mvc.handler.GatewayRouterFunctions.route;
import static org.springframework.cloud.gateway.server.mvc.handler.HandlerFunctions.http;
import static org.springframework.cloud.gateway.server.mvc.predicate.GatewayRequestPredicates.path;

@Configuration
public class ApplicationConfig {

  @Bean
  public RouterFunction<ServerResponse> getRoute() {
    return route("party-service")
        .route(path("/api/**"), http("https://serendipity.localhost:30101/api"))
        .build();
  }

}
