package org.serendipity.webbff.service;

import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

@Service
@Slf4j
public class AuthNService {

  public String getUrl() {

    log.info("AuthNService -> getUrl()");

    return "http://127.0.0.1:8080/oauth2/authorization/keycloak";

  }

}

// https://stackoverflow.com/questions/46689034/logout-user-via-keycloak-rest-api-doesnt-work
