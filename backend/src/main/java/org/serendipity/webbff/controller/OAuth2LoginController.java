package org.serendipity.webbff.controller;

import lombok.extern.slf4j.Slf4j;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.client.OAuth2AuthorizedClient;
import org.springframework.security.oauth2.client.annotation.RegisteredOAuth2AuthorizedClient;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
@Slf4j
public class OAuth2LoginController {

  @GetMapping("/")
  public String index(Model model,
                      @RegisteredOAuth2AuthorizedClient OAuth2AuthorizedClient authorizedClient,
                      @AuthenticationPrincipal OAuth2User oauth2User) {

    log.info("OAuth2LoginController -> index()");

    model.addAttribute("userName", oauth2User.getName());
    // model.addAttribute("userName", "rob.ferguson");
    model.addAttribute("clientName", authorizedClient.getClientRegistration().getClientName());
    model.addAttribute("userAttributes", oauth2User.getAttributes());

    return "index";
  }

}

// https://docs.spring.io/spring-security/site/docs/5.2.12.RELEASE/reference/html/oauth2.html#oauth2login-boot-property-mappings

// https://github.com/spring-projects/spring-security-samples/blob/main/servlet/spring-boot/java/oauth2/login/src/main/java/example/web/OAuth2LoginController.java
