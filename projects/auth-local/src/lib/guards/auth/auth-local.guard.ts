import { Injectable } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';

import { Observable } from 'rxjs';

import { LoggerService } from 'utils';

@Injectable({
  providedIn: 'root'
})
export class AuthLocalGuard implements CanActivate {

  constructor(private router: Router,
              private logger: LoggerService) {}

  canActivate(next: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {

    this.logger.info('AuthLocalGuard: canActivate()');

    return true;
  }

}
