package org.serendipity.webbff.controller;

import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.serendipity.webbff.model.LoginResponse;
import org.serendipity.webbff.service.AuthNService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.server.ResponseStatusException;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

@AllArgsConstructor
@Controller
@Slf4j
public class AuthNController {

  // private static final String REDIRECT_PATH = "redirect:/login-callback";
  // private static final String REDIRECT_PATH = "forward:/login-callback";
  // private static final String REDIRECT_PATH = "redirect:/?authN=true";
  // private static final String REDIRECT_PATH = "forward:/"; -> http://127.0.0.1:8080/not-found
  // private static final String REDIRECT_PATH = "forward:/login-callback"; -> didn't work
  // private static final String REDIRECT_PATH = "forward:/?authN=true"; -> http://127.0.0.1:8080/bff/login/success

  private static final String REDIRECT_PATH = "forward:/";

  private final AuthNService authNService;

  @PostMapping("/bff/login")
  public ResponseEntity<LoginResponse> login(HttpServletResponse response)
    throws ResponseStatusException {

    log.info("AuthNController POST /bff/login");

    try {

      LoginResponse model = new LoginResponse();
      model.setAuthorizationRequestUrl(this.authNService.getUrl());

      log.info("requestUrl: {}", model.getAuthorizationRequestUrl());

      return ResponseEntity.ok(model);

    } catch (Exception e) {

      log.error("{}", e.getLocalizedMessage());

      throw new ResponseStatusException(HttpStatus.BAD_REQUEST);
    }

  }

  @ResponseStatus(HttpStatus.OK)
  @GetMapping("/bff/login/success")
  public String loginSuccess(HttpServletRequest request, HttpServletResponse response)
    throws ResponseStatusException {

    log.info("AuthNController GET /bff/login/success");

    try {

      return REDIRECT_PATH;

    } catch (Exception e) {

      log.error("{}", e.getLocalizedMessage());

      throw new ResponseStatusException(HttpStatus.BAD_REQUEST);
    }

  }

  /*

  @GetMapping("/oauth2/authorization/keycloak")
  public ResponseEntity<Void> redirect(HttpServletRequest request,
                                       HttpServletResponse response) throws ResponseStatusException {

    log.info("AuthNController GET /oauth2/authorization/keycloak");

    try {

      return ResponseEntity.status(HttpStatus.FOUND)
        .location(URI.create("https://docs.spring.io/spring-security/site/docs/current/reference/html5/#cors"))
        .build();

      // return ResponseEntity.status(HttpStatus.FOUND)
      //   .location(URI.create(request.getScheme() + "://127.0.0.1:10001/auth/realms/development/protocol/openid-connect/auth"))
      //   .build();

    } catch (Exception e) {

      log.error("{}", e.getLocalizedMessage());

      throw new ResponseStatusException(HttpStatus.BAD_REQUEST);
    }

  }

  */

}

// https://docs.spring.io/spring-security/site/docs/5.2.12.RELEASE/reference/html/oauth2.html#oauth2login-boot-property-mappings

// https://github.com/spring-projects/spring-security-samples/blob/main/servlet/spring-boot/java/oauth2/login/src/main/java/example/web/OAuth2LoginController.java

// @CrossOrigin

// private static final String REDIRECT_PATH = "redirect:/oauth2/authorization/keycloak";

/*

  @ResponseStatus(HttpStatus.OK)
  @GetMapping("/bff/login/success")
  public String loginSuccess(HttpServletRequest request, HttpServletResponse response)
    throws ResponseStatusException {

    log.info("AuthNController GET /bff/login/success");

    try {

      return REDIRECT_PATH;

    } catch (Exception e) {

      log.error("{}", e.getLocalizedMessage());

      // throw new ResponseStatusException(HttpStatus.BAD_REQUEST);
    }

    return ERROR_PATH;

  }

 */

  /*

  @ResponseStatus(HttpStatus.OK)
  // @CrossOrigin(origins = "http://127.0.0.1:8080")
  @PostMapping("/bff/login")
  public String login(HttpServletResponse response) throws ResponseStatusException {

    log.info("AuthNController POST /bff/login");

    try {

      return REDIRECT_PATH;

    } catch (Exception e) {

      log.error("{}", e.getLocalizedMessage());

      throw new ResponseStatusException(HttpStatus.BAD_REQUEST);
    }

  }

  */

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
