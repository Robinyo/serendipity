/*
 * Public API Surface of serendipity-utils-lib
 */

// Export runtime InjectionTokens and classes normally so Angular preserves the DI token metadata
export { APP_ENVIRONMENT } from './lib/models/environment.token.js';
export { SVG_ICONS } from './lib/constants/svg-icons.js';

export { AbstractCollectionService } from './lib/services/abstract/collection/collection.js';
export { ConfigService } from './lib/services/config/config.service.js';
export { FormsService } from './lib/services/forms/forms.js';
export { LoggerService } from './lib/services/logger/logger.service.js';

// Use "export type" for pure data models and interfaces to let isolatedModules compile them correctly
export type { Adapter } from './lib/adapters/adapter.js';
export type { Environment } from './lib/models/environment.js';
export type { HttpOptions } from './lib/models/http-options.js';
export type { SvgIconRegistry } from './lib/models/svg-icon-registry.js';
