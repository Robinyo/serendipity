import { Inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Observable } from 'rxjs';

import { DynamicFormsConfig } from '../../../shared/models';
import { DynamicFormsConfigService } from '../../../services/config.service';

import { DynamicFormControlModel } from '../../models/dynamic-form-control.model';

import { LoggerService } from 'utils';

@Injectable({
  providedIn: 'root'
})
export class DynamicFormMetadataService {

  private url = 'assets/data/forms/';

  constructor(@Inject(DynamicFormsConfigService) private config: DynamicFormsConfig,
              private httpClient: HttpClient, private logger: LoggerService) {

    this.url = this.url + this.config.defaultLanguage + '/';

    this.logger.info('DynamicFormMetadataService: url: ' + this.url);
  }

  public get(filename: string): Observable<DynamicFormControlModel[]>   {
    return this.httpClient.get<DynamicFormControlModel[]>(this.url + filename);
  }

}
