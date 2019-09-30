import { User } from '../../models/user';

export abstract class Auth {

  protected authenticated = false;
  protected accessToken = '';

  public abstract isAuthenticated(): boolean;

  public abstract getAccessToken(): string;

  public abstract createUserWithEmailAndPassword(user: User): Promise<any>;
  public abstract loginWithEmailAndPassword(email: string, password: string): Promise<any>;

  public abstract loginWithRedirect();

  public abstract async handleRedirectCallback(): Promise<void>;

  public abstract logout(returnUrl: string);

}
