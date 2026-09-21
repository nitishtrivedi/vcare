import { Injectable, signal } from '@angular/core';
import { AuthResponse, AuthUser } from '../models/blog.model';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly apiBaseUrl = this.resolveApiBaseUrl();

  readonly currentUser = signal<AuthUser | null>(null);

  readonly isAuthenticated = signal(false);

  private sessionResolved = false;

  private resolveApiBaseUrl(): string {
    if (typeof window === 'undefined') {
      return '/api';
    }

    const hostname = window.location.hostname;

    /*
     * When Angular is running locally,
     * use the development Hostinger API.
     */
    if (hostname === 'localhost' || hostname === '127.0.0.1') {
      return 'https://dev.vcarepreschool.in/api';
    }

    /*
     * On dev and production domains,
     * use the same-domain /api path.
     */
    return '/api';
  }

  get apiUrl(): string {
    return this.apiBaseUrl;
  }

  // private async request(action: string, options: RequestInit = {}): Promise<AuthResponse> {
  //   const url = `${this.apiBaseUrl}/auth.php?action=` + encodeURIComponent(action);

  //   const response = await fetch(url, {
  //     ...options,
  //     credentials: 'include',

  //     headers: {
  //       Accept: 'application/json',

  //       ...(options.body
  //         ? {
  //             'Content-Type': 'application/json',
  //           }
  //         : {}),

  //       ...(options.headers ?? {}),
  //     },
  //   });

  //   let result: AuthResponse;

  //   try {
  //     result = (await response.json()) as AuthResponse;
  //   } catch {
  //     throw new Error('Invalid response from authentication server.');
  //   }

  //   if (!response.ok) {
  //     throw new Error(result.message ?? 'Authentication request failed.');
  //   }

  //   return result;
  // }

  private async request(action: string, options: RequestInit = {}): Promise<AuthResponse> {
    const url = `${this.apiBaseUrl}/auth.php?action=` + encodeURIComponent(action);

    const response = await fetch(url, {
      ...options,
      credentials: 'include',

      headers: {
        Accept: 'application/json',

        ...(options.body
          ? {
              'Content-Type': 'application/json',
            }
          : {}),

        ...(options.headers ?? {}),
      },
    });

    let result: AuthResponse;

    try {
      result = (await response.json()) as AuthResponse;
    } catch {
      throw new Error('Invalid response from authentication server.');
    }

    /*
     * A 401 from the session endpoint simply means
     * that no authenticated session currently exists.
     *
     * Let restoreSession() handle that normally.
     */
    if (response.status === 401 && action === 'session') {
      return {
        success: false,
        message: result.message ?? 'No active session.',
      };
    }

    if (!response.ok) {
      throw new Error(result.message ?? 'Authentication request failed.');
    }

    return result;
  }
  async login(username: string, password: string): Promise<AuthResponse> {
    const result = await this.request('login', {
      method: 'POST',

      body: JSON.stringify({
        username: username.trim(),

        password,
      }),
    });

    /*
     * A successful authentication response
     * contains success=true and a valid user object.
     *
     * We do NOT require the PHP response to also
     * contain authenticated=true.
     */
    if (result.success && result.user) {
      this.currentUser.set(result.user);

      this.isAuthenticated.set(true);
    } else {
      this.currentUser.set(null);

      this.isAuthenticated.set(false);
    }

    this.sessionResolved = true;

    return result;
  }

  async restoreSession(): Promise<boolean> {
    if (this.sessionResolved) {
      return this.isAuthenticated();
    }

    try {
      const result = await this.request('session', {
        method: 'GET',
      });

      /*
       * A valid active session is identified
       * by the presence of the authenticated
       * user object.
       */
      if (result.success && result.user) {
        this.currentUser.set(result.user);

        this.isAuthenticated.set(true);
      } else {
        this.currentUser.set(null);

        this.isAuthenticated.set(false);
      }
    } catch {
      this.currentUser.set(null);

      this.isAuthenticated.set(false);
    }

    this.sessionResolved = true;

    return this.isAuthenticated();
  }

  async logout(): Promise<void> {
    try {
      await this.request('logout', {
        method: 'POST',
      });
    } finally {
      this.currentUser.set(null);

      this.isAuthenticated.set(false);

      this.sessionResolved = true;
    }
  }
}
