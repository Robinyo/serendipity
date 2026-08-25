package org.serendipity.webbff.controller;

import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.core.oidc.user.OidcUser;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Collections;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api")
public class ProfileController {

  @GetMapping("/me")
  public Map<String, Object> getUserProfile(@AuthenticationPrincipal OidcUser principal) {
    if (principal == null) {
      return Map.of("authenticated", false);
    }

    // Extract roles from Keycloak's realm_access claim
    Map<String, Object> realmAccess = principal.getClaim("realm_access");
    List<String> roles = Collections.emptyList();

    if (realmAccess != null && realmAccess.get("roles") instanceof List<?>) {
      roles = ((List<?>) realmAccess.get("roles")).stream()
        .map(Object::toString)
        .collect(Collectors.toList());
    }

    return Map.of(
      "authenticated", true,
      "username", principal.getPreferredUsername(),
      "name", principal.getFullName(),
      "email", principal.getEmail(),
      "roles", roles
    );
  }

}
