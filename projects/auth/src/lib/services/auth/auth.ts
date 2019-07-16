export abstract class Auth {

  protected authenticated = false;
  protected accessToken = '';

  public abstract isAuthenticated(): boolean;

  public abstract getAccessToken(): string;

}
