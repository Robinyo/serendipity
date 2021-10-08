package org.serendipity.webbff.service;

import lombok.extern.slf4j.Slf4j;
import org.serendipity.webbff.model.TokenResponse;
import org.serendipity.webbff.utils.AuthConstants;
import org.springframework.core.env.Environment;
import org.springframework.stereotype.Service;
import org.springframework.util.Assert;
import org.springframework.web.reactive.function.client.WebClient;
import org.springframework.web.util.UriComponents;
import org.springframework.web.util.UriComponentsBuilder;

import static org.springframework.web.reactive.function.BodyInserters.fromFormData;

@Service
@Slf4j
public class AuthNService {

  private final Environment env;
  private final WebClient webClient;

  private String clientId;
  private String redirectUri;

  public AuthNService(Environment env, WebClient webClient) {
    this.env = env;
    this.webClient = webClient;
  }

  public String getUrl(String state) {

    log.info("AuthService -> getUrl()");

    String baseUrl = env.getProperty("BASE_URL");
    String authorizationEndpoint = env.getProperty("AUTHORIZATION_ENDPOINT");
    this.clientId = env.getProperty("CLIENT_ID");
    this.redirectUri = env.getProperty("REDIRECT_URI");

    Assert.notNull(baseUrl, "BASE_URL environment variable not found");
    Assert.notNull(authorizationEndpoint, "AUTHORIZATION_ENDPOINT environment variable not found");
    Assert.notNull(this.clientId, "CLIENT_ID environment variable not found");
    Assert.notNull(this.redirectUri, "REDIRECT_URI environment variable not found");

    UriComponents builder = UriComponentsBuilder
      .fromHttpUrl(baseUrl)
      .path(authorizationEndpoint)
      .queryParam("response_type", AuthConstants.RESPONSE_TYPE)
      .queryParam("client_id", this.clientId)
      .queryParam("redirect_uri", this.redirectUri)
      .queryParam("scope", AuthConstants.SCOPE)
      .queryParam("state", state)
      .build()
      .encode();

    log.info("url = {}", builder.toString());

    return builder.toString();

  }

  public TokenResponse tokenRequest(String code) {

    log.info("AuthService -> tokenRequest()");

    String tokenEndpoint = env.getProperty("TOKEN_ENDPOINT");
    String clientSecret = env.getProperty("CLIENT_SECRET");

    Assert.notNull(tokenEndpoint, "TOKEN_ENDPOINT environment variable not found");
    Assert.notNull(clientSecret, "CLIENT_SECRET environment variable not found");

    return webClient
      .post()
      .uri(uriBuilder -> uriBuilder
        .path(tokenEndpoint)
        .build())
      .body(
        fromFormData("grant_type", AuthConstants.GRANT_TYPE)
          .with("client_id", this.clientId)
          .with("redirect_uri", this.redirectUri)
          .with("client_secret", clientSecret)
          .with("code", code))
      .retrieve()
      .bodyToMono(TokenResponse.class)
      .block();

  }

}
