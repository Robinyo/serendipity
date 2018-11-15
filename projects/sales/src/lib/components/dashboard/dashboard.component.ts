import { Component, OnInit } from '@angular/core';

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
    'value': 3002
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

  accountsColorScheme = {
    domain: ['#2196F3']
  };

  contactsColorScheme = {
    domain: ['#03A9F4']
  };

  leadsColorScheme = {
    domain: ['#4CAF50']
  };

  opportunitiesColorScheme = {
    domain: ['#8BC34A']
  };

  constructor() {

    Object.assign(this, {accounts});
    Object.assign(this, {contacts});
    Object.assign(this, {leads});
    Object.assign(this, {opportunities});
  }

  ngOnInit() {
  }

  onSelect(event) {
  }

}

// https://en.wikipedia.org/wiki/Golden_ratio -> 1.61803398875

// https://material.io/design/color/the-color-system.html#tools-for-picking-colors

/*

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
