package org.serendipity.webbff.controller;

import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.client.OAuth2AuthorizedClient;
import org.springframework.security.oauth2.client.OAuth2AuthorizedClientService;
import org.springframework.security.oauth2.client.annotation.RegisteredOAuth2AuthorizedClient;
import org.springframework.security.oauth2.client.authentication.OAuth2AuthenticationToken;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.util.StringUtils;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.reactive.function.client.ClientRequest;
import org.springframework.web.reactive.function.client.ExchangeFilterFunction;
import org.springframework.web.reactive.function.client.WebClient;

import reactor.core.publisher.Mono;

import java.util.Collections;
import java.util.Map;

@Controller
@Slf4j
public class OAuth2LoginController {

  @Autowired
  private OAuth2AuthorizedClientService authorizedClientService;

  @GetMapping("/")
  public String index(Model model,
                      @RegisteredOAuth2AuthorizedClient("keycloak") OAuth2AuthorizedClient authorizedClient,
                      @AuthenticationPrincipal OAuth2User oauth2User) {

    log.info("OAuth2LoginController -> index()");

    model.addAttribute("userName", oauth2User.getName());
    model.addAttribute("clientName", authorizedClient.getClientRegistration().getClientName());
    model.addAttribute("userAttributes", oauth2User.getAttributes());

    return "index";
  }

  @GetMapping("/bff/userinfo")
  public String userinfo(Model model, OAuth2AuthenticationToken authentication) {

    OAuth2AuthorizedClient authorizedClient = this.getAuthorizedClient(authentication);

    Map userAttributes = Collections.emptyMap();
    String userInfoEndpointUri = authorizedClient.getClientRegistration()
      .getProviderDetails().getUserInfoEndpoint().getUri();

    if (!StringUtils.isEmpty(userInfoEndpointUri)) {	// userInfoEndpointUri is optional for OIDC Clients
      userAttributes = WebClient.builder()
        .filter(oauth2Credentials(authorizedClient))
        .build()
        .get()
        .uri(userInfoEndpointUri)
        .retrieve()
        .bodyToMono(Map.class)
        .block();
    }

    model.addAttribute("userAttributes", userAttributes);
      return "userinfo";
  }

  private OAuth2AuthorizedClient getAuthorizedClient(OAuth2AuthenticationToken authentication) {
    return this.authorizedClientService.loadAuthorizedClient(
      authentication.getAuthorizedClientRegistrationId(), authentication.getName());
  }

  private ExchangeFilterFunction oauth2Credentials(OAuth2AuthorizedClient authorizedClient) {
    return ExchangeFilterFunction.ofRequestProcessor(
      clientRequest -> {
        ClientRequest authorizedRequest = ClientRequest.from(clientRequest)
          .header(HttpHeaders.AUTHORIZATION, "Bearer " + authorizedClient.getAccessToken().getTokenValue())
          .build();
        return Mono.just(authorizedRequest);
      });
  }

}

// https://docs.spring.io/spring-security/site/docs/5.2.12.RELEASE/reference/html/oauth2.html#oauth2login-boot-property-mappings

// https://github.com/spring-projects/spring-security-samples/blob/main/servlet/spring-boot/java/oauth2/login/src/main/java/example/web/OAuth2LoginController.java

/*

  @GetMapping("/bff/login")
  public String bffLogin(Model model,
                         @RegisteredOAuth2AuthorizedClient("keycloak") OAuth2AuthorizedClient authorizedClient,
                         @AuthenticationPrincipal OAuth2User oauth2User) {

    log.info("OAuth2LoginController -> bffLogin()");

    model.addAttribute("userName", oauth2User.getName());
    model.addAttribute("clientName", authorizedClient.getClientRegistration().getClientName());
    model.addAttribute("userAttributes", oauth2User.getAttributes());

    return "index";
  }

*/
