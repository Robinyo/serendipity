import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { DomSanitizer } from "@angular/platform-browser";

import { MatIconRegistry } from "@angular/material/icon";

import { SVG_ICONS } from '../../svg-icons';

@Injectable({
  providedIn: 'root'
})
export class ConfigService {

  private uriPrefix = 'assets/data/config/';
  private uriSuffix = '.json';

  constructor(private domSanitizer: DomSanitizer,
              private httpClient: HttpClient,
              private matIconRegistry: MatIconRegistry) {}

  public get(filename: string): Promise<any> {
    return this.httpClient.get<any>(this.uriPrefix + filename + this.uriSuffix).toPromise();
  }

  public loadSvgIcons(): void {

    const svgIconPath = '../../../assets/images/icons/';

    SVG_ICONS.forEach(svgIcon => {

      if (svgIcon.name != undefined && svgIcon.filename != undefined) {

        this.matIconRegistry.addSvgIcon(
          svgIcon.name,
          this.domSanitizer.bypassSecurityTrustResourceUrl(svgIconPath + svgIcon.filename)
        );

      }
    });

  }

}

/*

// import { Inject, Injectable } from '@angular/core';

// import { UtilsConfig } from '../../models/models';
// import { UtilsConfigService } from '../config.service';

  constructor(@Inject(UtilsConfigService) private config: UtilsConfig,
              private httpClient: HttpClient) {

    // this.uriPrefix = this.uriPrefix + this.config.defaultLanguage.split('-')[0] + '/';
  }

*/
