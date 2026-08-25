/*
 * Public API Surface of serendipity-work-lib
 */

// Export runtime classes normally so Angular preserves the DI token metadata
export { workflowRoutes } from './lib/lib.routes.js';

export { Activities } from './lib/features/activities/activities.js';
export { Tasks } from './lib/features/tasks/tasks.js';

// Use "export type" for interfaces to let isolatedModules compile them correctly

