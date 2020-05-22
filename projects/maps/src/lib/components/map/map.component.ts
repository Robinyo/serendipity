import { Component, OnInit, Input } from '@angular/core';

import { MapOptions } from 'leaflet';

import { LoggerService } from 'utils';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.scss']
})
export class MapComponent implements OnInit {

  @Input() options: MapOptions = {};

  @Input() layersControl: any;

  constructor(private logger: LoggerService) {}

  ngOnInit(): void {
    this.logger.info('MapComponent: ngOnInit()');
  }

}
