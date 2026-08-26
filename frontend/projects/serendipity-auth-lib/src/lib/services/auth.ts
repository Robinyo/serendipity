import { inject, Injectable, InjectionToken, signal, computed, Signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap, map, catchError, of } from 'rxjs';

import { UserProfile } from '../models/user';

export const AUTH_SERVICE_TOKEN = new InjectionToken<AuthService>('AUTH_SERVICE_TOKEN');

@Injectable()
export class AuthService {

  private http = inject(HttpClient);

  // Private writeable signal manages the internal state
  private currentUserSignal = signal<UserProfile | null>(null);

  // 1. Public read-only signal that exposes the full profile
  public getProfile: Signal<UserProfile | null> = computed(() => this.currentUserSignal());

  // 2. Public read-only signal that exposes just the username
  public getUsername: Signal<string | undefined> = computed(() => this.currentUserSignal()?.username);

  // Check if session exists (returns true/false for the guard)
  checkSession(): Observable<boolean> {
    // If we already verified the user, don't hit the network again
    if (this.currentUserSignal()?.authenticated) return of(true);

    return this.http.get<UserProfile>('/api/me').pipe(
      tap(profile => this.currentUserSignal.set(profile)),
      map(profile => !!profile.authenticated),
      catchError(() => {
        this.currentUserSignal.set({ authenticated: false });
        return of(false);
      })
    );
  }

  // Helper method to easily check if a user is logged in within templates
  isAuthenticated(): boolean {
    return !!this.currentUserSignal()?.authenticated;
  }

}
