package au.gov.dta.rp.util;

public class AuthConstants {

  public static final int TIMEOUT = 10000; // 10 seconds
  public static final int ONE_HOUR = 60 * 60 * 1000;

  public static final String BASE_URL = "https://onb.auth.identity.gov.au";
  public static final String SIGN_IN_PATH = "/authorise";
  // public static final String SCOPE = "openid+profile";
  public static final String SCOPE = "openid+profile+tdif_business_authorisations";
  public static final String RESPONSE_TYPE = "code";
  // public static final String REDIRECT_URI = "https://java-spring-boot-relying-party-example.apps.y.cld.gov.au/authorization-code/callback";
  public static final String REDIRECT_URI = "https://python-flask-relying-party-example.apps.y.cld.gov.au/success";
  public static final String ACR_VALUES = "urn:id.gov.au:tdif:acr:ip2:cl2";
  public static final String TOKEN_REQUEST_PATH = "/sso/sps/oauth/oauth20/token";
  public static final String GRANT_TYPE = "authorization_code";
  public static final String CLIENT_ASSERTION_TYPE = "urn:ietf:params:oauth:client-assertion-type:jwt-bearer";
  public static final String BUSINESS_AUTHORISATIONS_REQUEST_PATH = "/sso/sps/oauth/oauth20/userinfo";

  private AuthConstants(){
    throw new AssertionError();
  }

}

// public static final String SCOPE = "openid+profile+email+tdif_doc+tdif_business_authorisations";

// public static final String BASE_URL = "https://jsonplaceholder.typicode.com";

// public static final String SCOPE = "openid profile";
// public static final String[] SCOPE = {"openid" , "profile"};
// public static final String STATE = "123456789";
// public static final String NONCE = "987654321";
// public static final String[] ACR_VALUES = {"urn:id.gov.au:tdif:acr:ip2:cl2"};
