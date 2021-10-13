package org.serendipity.webbff.controller;

import lombok.extern.slf4j.Slf4j;
import org.serendipity.webbff.model.LoginResponse;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.server.ResponseStatusException;

import javax.servlet.http.HttpServletResponse;

@Controller
@Slf4j
public class OAuth2LoginController {

  // @PostMapping("/bff/login")
  @GetMapping("/bff/login")
  public ResponseEntity<LoginResponse> login(HttpServletResponse response) throws ResponseStatusException {

    log.info("OAuth2LoginController -> /bff/login");

    try {

      return ResponseEntity.noContent().build();

    } catch (Exception e) {

      log.error("{}", e.getLocalizedMessage());

      throw new ResponseStatusException(HttpStatus.BAD_REQUEST);
    }

  }

  /*

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

  */

}

// https://docs.spring.io/spring-security/site/docs/5.2.12.RELEASE/reference/html/oauth2.html#oauth2login-boot-property-mappings

// https://github.com/spring-projects/spring-security-samples/blob/main/servlet/spring-boot/java/oauth2/login/src/main/java/example/web/OAuth2LoginController.java

/*

  @RequestMapping("/error")
  @ResponseStatus(HttpStatus.OK)
  public String error() {

    log.info("OAuth2LoginController -> /error");

    // return "redirect:/index.html";
    return "redirect:/";

  }

*/

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
