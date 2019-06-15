import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { Dashboard } from '../../../models/models';

@Injectable({
  providedIn: 'root'
})
export class MockDashboardService {

  private readonly URL = 'assets/data/dashboards.json';

  constructor(protected httpClient: HttpClient) {}

  public getDashboard(dashboardId: string): Observable<Dashboard>  {

    return this.httpClient.get<Dashboard[]>(this.URL).pipe(
      map((dashboards: Dashboard[]) => dashboards.find(dashboard => dashboard.id === dashboardId)));
  }

}

// https://stackoverflow.com/questions/14667713/typescript-converting-a-string-to-a-number

// const id: number = Number(dashboardId);

/*

json.forEach(function(obj) { console.log(obj.id); });

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Observable } from 'rxjs';

import { Venue } from '@core/models';

@Injectable()
export class MockVenuesService  {

  private readonly URL = 'assets/data/venues.json';

  constructor(protected httpClient: HttpClient) {}

  public list(): Observable<Venue[]> {
    return this.httpClient.get<Venue[]>(this.URL);
  }

}

*/
