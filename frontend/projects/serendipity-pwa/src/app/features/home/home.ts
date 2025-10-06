import { Component, inject } from '@angular/core';
import { DomSanitizer } from "@angular/platform-browser";

import { MatButtonModule } from '@angular/material/button';
import { MatIconModule, MatIconRegistry } from "@angular/material/icon";

import { LoggerService } from 'serendipity-utils-lib';

import { SVG_ICONS } from './svg-icons';

const PATH = '../assets/images/icons/misc/';

@Component({
  selector: 'app-home',
  imports: [
    MatButtonModule,
    MatIconModule
  ],
  templateUrl: './home.html',
  standalone: true,
  styleUrl: './home.scss'
})
export class Home {

  private matIconRegistry : MatIconRegistry = inject(MatIconRegistry);
  private domSanitizer: DomSanitizer = inject(DomSanitizer);
  private logger: LoggerService = inject(LoggerService);

  constructor() {

    this.logger.info('Welcome');

    SVG_ICONS.forEach(svgIcon => {

      if (svgIcon.name != undefined && svgIcon.filename != undefined) {

        // https://material.angular.dev/components/icon/overview#svg-icons

        this.matIconRegistry.addSvgIcon(
          svgIcon.name,
          this.domSanitizer.bypassSecurityTrustResourceUrl(PATH + svgIcon.filename)
        );

      }
    });

  }

}


