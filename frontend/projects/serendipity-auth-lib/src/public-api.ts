/*
 * Public API Surface of serendipity-auth-lib
 */

// Export runtime classes normally so Angular preserves the DI token metadata
export { authGuard } from './lib/guards/auth';

export { AUTH_SERVICE_TOKEN, AuthService } from './lib/services/auth';

// Use "export type" for interfaces to let isolatedModules compile them correctly
export type { UserProfile } from './lib/models/user';
