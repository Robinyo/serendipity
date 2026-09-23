export interface UserProfile {
  authenticated: boolean;
  // name?: string;
  username?: string;
  email?: string;
  firstName?: string;
  lastName?: string;
  // id?: string;
  // enabled?: string;
  // emailVerified?: string;
  // createdTimestamp?: string;
  jobTitle?: string;
  department?: string;
  manager?: string;
  // companyName?: string;
  // employeeId?: string;
  employeeType?: string;
  // employeeHireDate?: string;
  roles?: string[];
}

// https://www.keycloak.org/docs/latest/server_admin/index.html#user-profile
