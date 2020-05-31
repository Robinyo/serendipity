import {  Inject, Injectable } from '@angular/core';

import { UtilsConfig } from '../../models/models';
import { UtilsConfigService } from '../config.service';

@Injectable({
  providedIn: 'root'
})
export class EnvironmentService {

  constructor(@Inject(UtilsConfigService) private config: UtilsConfig) {

    if (this.config.isDebugMode) {
      console.log('Environment Service registered');
    }

  }

  getConfig(): UtilsConfig {
    return this.config;
  }

}
