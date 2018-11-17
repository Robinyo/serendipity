import { Component, OnInit } from '@angular/core';

import {
  single,
  multi,
  bubble,
  generateData,
  generateGraph,
  treemap,
  timelineFilterBarData,
  fiscalYearReport
} from './data';

const accounts = [
  {
    'name': 'Accounts',
    'value': 1001
  }
];

const contacts = [
  {
    'name': 'Contacts',
    'value': 2002
  }
];

const leads = [
  {
    'name': 'Leads',
    'value': 3003
  }
];

const opportunities = [
  {
    'name': 'Opportunities',
    'value': 4004
  }
];

@Component({
  selector: 'sales-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {

  accounts: any[];
  contacts: any[];
  leads: any[];
  opportunities: any[];

  smallView: any[] = [322, 200];
  largeView: any[] = [644, 400];

  // '#647c8a', '#3f51b5', '#2196f3', '#00b862', '#afdf0a', '#a7b61a', '#f3e562', '#ff9800', '#ff5722', '#ff4514'

  accountsColorScheme = {
    domain: ['#2196f3']  // #2196F3
  };

  contactsColorScheme = {
    domain: ['#03A9F4']  // #03A9F4
  };

  leadsColorScheme = {
    domain: ['#00b862']  // #4CAF50
  };

  opportunitiesColorScheme = {
    domain: ['#afdf0a']  // #8BC34A
  };

  single: any[];
  schemeType = 'ordinal';

  // Options
  animations = true;
  gradient = false;
  showXAxis = true;
  showXAxisLabel = true;
  yAxisLabel = 'Country';
  showYAxis = true;
  showYAxisLabel = true;
  xAxisLabel = 'GDP Per Capita';

  showLegend = false;
  legendTitle = 'Legend';
  legendPosition = 'right';

  tooltipDisabled = false;
  showGridLines = true;
  barPadding = 8;
  roundDomains = false;
  roundEdges = true;
  xScaleMax: any;
  showDataLabel = false;

  constructor() {

    Object.assign(this, {
      accounts,
      contacts,
      leads,
      opportunities
    });

    Object.assign(this, {
      single
    });

  }

  ngOnInit() {
  }

  onSelect(event) {
  }

}

// https://github.com/swimlane/ngx-charts/blob/master/demo/app.component.ts

// https://en.wikipedia.org/wiki/Golden_ratio -> 1.61803398875

// https://material.io/design/color/the-color-system.html#tools-for-picking-colors

/*

    Object.assign(this, {
      single,
      multi,
      countries,
      chartGroups,
      colorSets,
      graph: generateGraph(50),
      bubble,
      plotData: this.generatePlotData(),
      treemap,
      fiscalYearReport
    });

const single = [
  {
    'name': 'Accounts',
    'value': 1000001
  }
];

  // https://github.com/angular/material2/blob/master/src/lib/core/theming/_palette.scss

  colorScheme = {
    domain: ['#ff5722']  // domain: ['#5AA454', '#A10A28', '#C7B42C']
  };

*/
