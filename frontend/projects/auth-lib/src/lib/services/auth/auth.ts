export abstract class Auth {

  protected authenticated = false;

  public abstract isAuthenticated(): boolean;

  public abstract loginWithRedirect(): Promise<void>;

  public abstract handleRedirectCallback(): void;

  public abstract logoutWithRedirect(returnUrl: string): Promise<void>;

}
