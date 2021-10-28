/*
 * Public API Surface of utils-lib
 */

export * from './lib/adapters/adapter';

export * from './lib/services/abstract/collection/collection.service';

export * from './lib/services/config/config.service';
export * from './lib/services/environment/environment.service';
export * from './lib/services/error/error.service';
export * from './lib/services/logger/logger.service';
export * from './lib/services/injector/static-injector.service';

export * from './lib/providers';

export * from './lib/models/config';
export * from './lib/models/http-options';

export * from './lib/utils-lib.module';

//
// Angular Material module
//

export * from './lib/angular-material/models/svg-icon-registry';

export * from './lib/angular-material/angular-material.module';
