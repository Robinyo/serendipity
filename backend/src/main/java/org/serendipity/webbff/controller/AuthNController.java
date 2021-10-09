package org.serendipity.webbff.controller;

import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.SerializationFeature;
import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.serendipity.webbff.model.LoginResponse;
import org.serendipity.webbff.model.TokenResponse;
import org.serendipity.webbff.service.AuthNService;
import org.serendipity.webbff.utils.AuthConstants;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.server.ResponseStatusException;

import javax.servlet.http.Cookie;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.util.UUID;

@AllArgsConstructor
@Controller
@RequestMapping("/")
@Slf4j
public class AuthNController {

  private static final String ERROR_PATH = "/error";
  // private static final String REDIRECT_PATH = "redirect:/"; -> worked
  // private static final String REDIRECT_PATH = "redirect:/welcome-page"; -> worked
  private static final String REDIRECT_PATH = "redirect:/welcome-page";

  private final AuthNService authNService;

  @PostMapping("/bff/login")
  public ResponseEntity<LoginResponse> signIn(HttpServletResponse response) {

    log.info("AuthNController POST /bff/login");

    String state = UUID.randomUUID().toString();

    Cookie authN = new Cookie("authN", "false");
    authN.setMaxAge(AuthConstants.COOKIE_MAX_AGE);
    response.addCookie(authN);

    Cookie authState = new Cookie("state", state);
    authState.setMaxAge(AuthConstants.COOKIE_MAX_AGE);
    response.addCookie(authState);

    try {

      LoginResponse model = new LoginResponse();
      model.setAuthorizationRequestUrl(authNService.getUrl(state));

      return ResponseEntity.ok(model);

    } catch (Exception e) {

      log.error("{}", e.getLocalizedMessage());

      throw new ResponseStatusException(HttpStatus.BAD_REQUEST);
    }

  }

  @GetMapping("/bff/authorization-code/callback")
  public String authorizationCodeCallback(HttpServletRequest request,
                                                @RequestParam(required = false) String code,
                                                @RequestParam(required = false) String state,
                                                HttpServletResponse response) {

    log.info("AuthNController GET /bff/authorization-code/callback");

    log.info("code={}", code);
    log.info("state={}", state);

    Cookie[] cookies = request.getCookies();

    String authState = "";

    for (Cookie cookie : cookies) {

      if (cookie.getName().equalsIgnoreCase("state")) {

        log.info("authState = cookie.getValue()");

        authState = cookie.getValue();
      }

    }

    if (!authState.equals(state)) {

      String errorMessage = "'authState' is not equal to 'state'";

      log.error(errorMessage);

      return ERROR_PATH;
    }

    try {

      TokenResponse tokenResponse = authNService.tokenRequest(code);

      for (Cookie cookie : cookies) {

        if (cookie.getName().equalsIgnoreCase("authN")) {

          log.info("authN = true");

          cookie.setValue("true");
        }

      }

      this.logInfo(tokenResponse);

      // private Integer expires_in;
      // private String scope;
      // private String token_type;

      Cookie idToken = new Cookie("id_token", tokenResponse.getId_token());
      idToken.setMaxAge(AuthConstants.COOKIE_MAX_AGE);
      response.addCookie(idToken);

      Cookie accessToken = new Cookie("access_token", tokenResponse.getAccess_token());
      accessToken.setMaxAge(AuthConstants.COOKIE_MAX_AGE);
      response.addCookie(accessToken);

      Cookie refreshToken = new Cookie("refresh_token", tokenResponse.getRefresh_token());
      refreshToken.setMaxAge(AuthConstants.COOKIE_MAX_AGE);
      response.addCookie(refreshToken);

      return REDIRECT_PATH;

    } catch (Exception e) {
      log.error("{}", e.getLocalizedMessage());
    }

    return ERROR_PATH;

  }

  protected void logInfo(Object model) {

    try {

      ObjectMapper mapper = new ObjectMapper();

      mapper.setSerializationInclusion(JsonInclude.Include.NON_NULL);
      mapper.setSerializationInclusion(JsonInclude.Include.NON_EMPTY);

      mapper.enable(SerializationFeature.INDENT_OUTPUT);

      if (model != null) {
        log.info("model: {}", "\n" + mapper.writeValueAsString(model));
      }

    } catch (JsonProcessingException jpe) {

      log.error("Json Processing Exception: {}", jpe.getLocalizedMessage());
    }

  }

}

/*

  @PostMapping("/login")
  public RedirectView signIn(HttpServletResponse response) {

    log.info("AuthNController POST /login");

    RedirectView redirectView = new RedirectView();

    String state = UUID.randomUUID().toString();

    Cookie authState = new Cookie("state", state);
    authState.setMaxAge(AuthConstants.COOKIE_MAX_AGE);
    response.addCookie(authState);

    try {

      redirectView.setUrl(authNService.getUrl(state));

    } catch (Exception e) {
      log.error("{}", e.getLocalizedMessage());
    }

    return redirectView;
  }

*/

/*

  @PostMapping("/login")
  public String login(HttpServletResponse response) {

    log.info("AuthController POST /login");

    String state = UUID.randomUUID().toString();

    Cookie authState = new Cookie("state", state);
    authState.setMaxAge(3600);
    response.addCookie(authState);

    try {

      return "redirect:/welcome-page";

    } catch (Exception e) {
      log.error("{}", e.getLocalizedMessage());
    }

    return "/error";
  }

*/
