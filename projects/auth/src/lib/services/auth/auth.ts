import { User } from '../../models/user.model';

export abstract class Auth {

  protected authenticated = false;
  protected accessToken = '';

  public abstract isAuthenticated(): boolean;

  public abstract getAccessToken(): string;

  public abstract createUserWithEmailAndPassword(user: User);

  public abstract loginWithEmailAndPassword(email: string, password: string);

  public abstract loginWithRedirect();

  public abstract async handleRedirectCallback(): Promise<void>;

  public abstract logout(returnUrl: string);

}
