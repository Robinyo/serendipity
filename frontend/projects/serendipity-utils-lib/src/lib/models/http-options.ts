import { HttpContext, HttpHeaders, HttpParams } from '@angular/common/http';

export interface HttpOptions {
  body?: any | null;
  headers?: HttpHeaders | { [header: string]: string | Array<string> };
  context?: HttpContext;
  observe?: any;
  params?: HttpParams | {
    [param: string]: string | number | boolean | ReadonlyArray<string | number | boolean>;
  };
  reportProgress?: boolean;
  responseType?: 'json';
  withCredentials?: boolean;
}
