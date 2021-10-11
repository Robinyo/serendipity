package org.serendipity.webbff.controller;

import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.SerializationFeature;
import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.serendipity.webbff.model.LoginResponse;
import org.serendipity.webbff.model.TokenResponse;
import org.serendipity.webbff.model.UserInfoResponse;
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
  private static final String REDIRECT_PATH = "redirect:/login-callback";

  private static final Boolean HTTP_ONLY_ATTRIBUTE = true;
  private static final Boolean SECURE_ATTRIBUTE = true;
  private static final String  PATH_ATTRIBUTE = "/";

  private final AuthNService authNService;

  @PostMapping("/bff/login")
  public ResponseEntity<LoginResponse> login(HttpServletResponse response) throws ResponseStatusException {

    log.info("AuthNController POST /bff/login");

    String state = UUID.randomUUID().toString();

    Cookie authState = new Cookie("state", state);
    authState.setMaxAge(AuthConstants.COOKIE_MAX_AGE);
    authState.setHttpOnly(HTTP_ONLY_ATTRIBUTE);
    authState.setSecure(SECURE_ATTRIBUTE);
    authState.setPath(PATH_ATTRIBUTE);
    response.addCookie(authState);

    try {

      LoginResponse model = new LoginResponse();
      model.setAuthorizationRequestUrl(this.authNService.getUrl(state));

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

    /*

    if (!authState.equals(state)) {

      String errorMessage = "'authState' is not equal to 'state'";

      log.error(errorMessage);

      return ERROR_PATH;
    }

   */

    try {

      TokenResponse tokenResponse = authNService.tokenRequest(code);

      this.logInfo(tokenResponse);

      // private Integer expires_in;
      // private String scope;
      // private String token_type;

      this.createCookies(response, tokenResponse);

      return REDIRECT_PATH;

    } catch (Exception e) {
      log.error("{}", e.getLocalizedMessage());
    }

    return ERROR_PATH;

  }

  @GetMapping("/bff/userInfo")
  public ResponseEntity<UserInfoResponse> userInfo(HttpServletResponse response) throws ResponseStatusException {

    log.info("AuthNController GET /bff/userInfo");

    try {

      UserInfoResponse model = new UserInfoResponse();
      model.setExp("1234");

      return ResponseEntity.ok(model);

    } catch (Exception e) {

      log.error("{}", e.getLocalizedMessage());

      throw new ResponseStatusException(HttpStatus.BAD_REQUEST);
    }

  }

  @PostMapping("/bff/logout")
  public ResponseEntity<Void> logout(HttpServletRequest request,
                                     HttpServletResponse response) throws ResponseStatusException {

    log.info("AuthNController POST /bff/logout");

    Cookie[] cookies = request.getCookies();

    String accessToken = "";
    String refreshToken = "";

    for (Cookie cookie : cookies) {

      if (cookie.getName().equalsIgnoreCase("access_token")) {

        accessToken = cookie.getValue();

        log.info("accessToken: {}", accessToken);
      }

      if (cookie.getName().equalsIgnoreCase("refresh_token")) {

        refreshToken = cookie.getValue();

        log.info("refreshToken: {}", refreshToken);
      }

    }

    try {

      this.authNService.logout(accessToken, refreshToken);

      this.deleteCookies(request, response);

      return ResponseEntity.noContent().build();

    } catch (Exception e) {

      log.error("{}", e.getLocalizedMessage());

      throw new ResponseStatusException(HttpStatus.BAD_REQUEST);
    }

  }

  protected void createCookies(HttpServletResponse response, TokenResponse tokenResponse) {

    Cookie authN = new Cookie("authN", "true");
    authN.setMaxAge(AuthConstants.COOKIE_MAX_AGE);
    authN.setPath(PATH_ATTRIBUTE);
    response.addCookie(authN);

    Cookie idToken = new Cookie("id_token", tokenResponse.getId_token());
    idToken.setMaxAge(AuthConstants.COOKIE_MAX_AGE);
    idToken.setHttpOnly(HTTP_ONLY_ATTRIBUTE);
    idToken.setSecure(SECURE_ATTRIBUTE);
    idToken.setPath(PATH_ATTRIBUTE);
    response.addCookie(idToken);

    Cookie accessToken = new Cookie("access_token", tokenResponse.getAccess_token());
    accessToken.setMaxAge(AuthConstants.COOKIE_MAX_AGE);
    accessToken.setHttpOnly(HTTP_ONLY_ATTRIBUTE);
    accessToken.setSecure(SECURE_ATTRIBUTE);
    accessToken.setPath(PATH_ATTRIBUTE);
    response.addCookie(accessToken);

    Cookie refreshToken = new Cookie("refresh_token", tokenResponse.getRefresh_token());
    refreshToken.setMaxAge(AuthConstants.COOKIE_MAX_AGE);
    refreshToken.setHttpOnly(HTTP_ONLY_ATTRIBUTE);
    refreshToken.setSecure(SECURE_ATTRIBUTE);
    refreshToken.setPath(PATH_ATTRIBUTE);
    response.addCookie(refreshToken);

  }

  protected void deleteCookies(HttpServletRequest request,
                               HttpServletResponse response) {

    // Cookie authN = new Cookie("authN", "");
    // authN.setMaxAge(0);
    // response.addCookie(authN);

    Cookie[] cookies = request.getCookies();

    for (Cookie cookie : cookies) {

      if (cookie.getName().equalsIgnoreCase("authN")) {

        cookie.setValue("false");
        cookie.setPath(PATH_ATTRIBUTE);
        response.addCookie(cookie);

        log.info("authN: false");
      }

    }

    Cookie authState = new Cookie("state", "");
    authState.setMaxAge(0);
    response.addCookie(authState);

    Cookie idToken = new Cookie("id_token", "");
    idToken.setMaxAge(0);
    response.addCookie(idToken);

    Cookie accessToken = new Cookie("access_token", "");
    accessToken.setMaxAge(0);
    response.addCookie(accessToken);

    Cookie refreshToken = new Cookie("refresh_token", "");
    refreshToken.setMaxAge(0);
    response.addCookie(refreshToken);

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

// private static final String REDIRECT_PATH = "redirect:/"; -> worked
// private static final String REDIRECT_PATH = "redirect:/welcome-page"; -> worked

/*

    // response.setHeader("Set-Cookie", "SameSite=strict");
    response.setHeader("Set-Cookie", "key=value; SameSite=strict");

    // response.setHeader("Set-Cookie", "key=value; HttpOnly; SameSite=strict")

*/


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
