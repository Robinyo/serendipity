export interface UserProfile {
  authenticated: boolean;
  username?: string;
  name?: string;
  email?: string;
  roles?: string[];
}
