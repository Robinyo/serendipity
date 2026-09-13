export interface UserProfile {
  authenticated: boolean;
  username?: string;
  name?: string;
  email?: string;
  firstName?: string;
  lastName?: string;
  id?: string;
  enabled: string;
  emailVerified: string;
  createdTimestamp: string;
  jobTitle: string;
  department: string;
  manager: string;
  companyName: string;
  employeeId: string;
  employeeType: string;
  employeeHireDate: string;
  roles?: string[];
}
