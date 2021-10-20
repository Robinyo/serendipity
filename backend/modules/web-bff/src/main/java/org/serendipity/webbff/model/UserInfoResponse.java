package org.serendipity.webbff.model;

import lombok.Data;

@Data

public class UserInfoResponse {

  private String exp;
  private String nbf;
  private String jti;
  private String iss;
  private String aud;
  private String sub;
  private String auth_time;
  private String iat;

}
