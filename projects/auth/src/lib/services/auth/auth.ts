export abstract class Auth {

  protected currentUser: any;

  protected accessToken = '';
  protected authenticated = false;
  protected idToken = '';

  public abstract isAuthenticated(): boolean;

  public abstract getAccessToken(): string;
  public abstract getIdToken(): string;

  public abstract getCurrentUser(): any;

  // Sign up new users - createUserWithEmailAndPassword(email: string, password: string)

  public abstract createUserWithEmailAndPassword(user: any): Promise<any>;

  // Sign in existing users - loginWithEmailAndPassword(), signInWithEmailAndPassword()

  public abstract loginWithEmailAndPassword(email: string, password: string): Promise<any>;

  // linkWithRedirect()

  public abstract async loginWithRedirect(): Promise<void>;

  // getRedirectResult()

  public abstract async handleRedirectCallback(): Promise<void>;

  public abstract logout(returnUrl: string);

}

// https://firebase.google.com/docs/auth/web/start
// https://firebase.google.com/docs/auth/web/manage-users
// https://firebase.google.com/docs/auth/web/account-linking
// https://firebase.google.com/docs/reference/js/#firebase.auth

// onAuthStateChanged()

/*

  get currentUser(): any {
    return this.user;
  }

// import { User } from '../../models/user';

// public abstract createUserWithEmailAndPassword(user: User): Promise<any>;

*/
