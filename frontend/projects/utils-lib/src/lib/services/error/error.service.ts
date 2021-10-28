import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ErrorService {

  constructor(private httpClient: HttpClient) {}

  protected getUrlPrefix(): string {
    return 'https://httpstat.us/';
  }

  get(statusCode: string = '404', delay: string = '4000') {

    // https://httpstat.us/404?sleep=4000"

    const url = this.getUrlPrefix() + statusCode + '?sleep=' + delay;

    this.httpClient.get(url).toPromise();

  }

}
