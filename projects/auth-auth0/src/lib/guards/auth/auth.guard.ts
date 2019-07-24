import { Injectable } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';

import { Observable } from 'rxjs';

import { Auth0AuthService } from '../../services/auth/auth.service';

@Injectable({
  providedIn: 'root'
})
export class Auth0AuthGuard implements CanActivate {

  constructor(private router: Router,
              private authService: Auth0AuthService) {}

  canActivate(next: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {

    if (this.authService.isAuthenticated()) {
      return true;
    }

    this.router.navigate(['/login'], { queryParams: { returnUrl: state.url }});
    return false;

  }

}
