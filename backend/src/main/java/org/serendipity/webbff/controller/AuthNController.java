package org.serendipity.webbff.controller;

import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;

import javax.servlet.http.Cookie;
import javax.servlet.http.HttpServletResponse;
import java.util.UUID;

@AllArgsConstructor
@Controller
@RequestMapping("/")
@Slf4j
public class AuthNController {

  // private final AuthNService authNService;

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

}
