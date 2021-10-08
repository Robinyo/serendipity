package org.serendipity.webbff.utils;

public class AuthConstants {

  public static final int TEN_SECONDS = 10 * 1000; // milliseconds
  public static final int ONE_HOUR = 60 * 60;
  public static final int TIMEOUT = TEN_SECONDS;
  public static final int COOKIE_MAX_AGE = ONE_HOUR;

  public static final String RESPONSE_TYPE = "code";
  // public static final String SCOPE = "openid profile email phone address offline_access";
  public static final String SCOPE = "openid profile";
  public static final String GRANT_TYPE = "authorization_code";

  private AuthConstants(){
    throw new AssertionError();
  }

}
