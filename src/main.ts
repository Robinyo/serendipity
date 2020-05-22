import { enableProdMode } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { AppModule } from '@app/app.module';
import { environment } from '@env/environment';

// WARNING in /Users/robferguson/workspace/Robinyo/serendipity/src/main.ts depends on hammerjs. CommonJS or AMD dependencies can cause
// optimization bailouts.
// For more info see: https://web.dev/commonjs-larger-bundles
// import 'hammerjs';

if (environment.production) {
  enableProdMode();
}

platformBrowserDynamic().bootstrapModule(AppModule)
  .catch(err => console.error(err));
