
import { Injectable, inject } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, catchError, map, of, tap } from 'rxjs';
import { ApiService } from './core/api.service';
import { User } from './core/models';

export type Role = 'user' | 'companion' | 'admin';

@Injectable({ providedIn: 'root' })
export class AppService {
  private readonly api = inject(ApiService);
  private readonly router = inject(Router);
  private readonly userSubject = new BehaviorSubject<User | null>(null);
  readonly user$ = this.userSubject.asObservable();

  readonly accounts = [
    { email: 'user@companion.demo', password: 'user123', role: 'user' as Role, name: 'Chandan Sharma' },
    { email: 'rohan@companion.demo', password: 'user123', role: 'user' as Role, name: 'Rohan Mehta' },
    { email: 'ananya@companion.demo', password: 'user123', role: 'user' as Role, name: 'Ananya Kapoor' },
    { email: 'companion@companion.demo', password: 'companion123', role: 'companion' as Role, name: 'Priya Singh' },
    { email: 'arjun@companion.demo', password: 'companion123', role: 'companion' as Role, name: 'Arjun Malhotra' },
    { email: 'simran@companion.demo', password: 'companion123', role: 'companion' as Role, name: 'Simran Kaur' },
    { email: 'kabir@companion.demo', password: 'companion123', role: 'companion' as Role, name: 'Kabir Verma' },
    { email: 'admin@companion.demo', password: 'admin123', role: 'admin' as Role, name: 'Platform Admin' }
  ];

  constructor() {
    const token = localStorage.getItem('companion-token');
    if (token) this.refreshMe().subscribe();
  }

  get role(): Role {
    return (localStorage.getItem('companion-role') as Role) || 'user';
  }

  login(email: string, password: string) {
    return this.api.login({ email: email.trim(), password }).pipe(
      tap(response => this.storeSession(response)),
      map(() => true)
    );
  }

  register(fullName: string, email: string, password: string, role: Role) {
    return this.api.register({ fullName: fullName.trim(), email: email.trim(), password, role: role.toUpperCase() }).pipe(
      tap(response => this.storeSession(response)),
      map(() => true)
    );
  }

  refreshMe() {
    return this.api.me().pipe(
      tap(user => {
        this.userSubject.next({
          id: user.id, fullName: user.fullName, email: user.email,
          role: String(user.role).toLowerCase(), status: user.status, city: user.city
        });
        localStorage.setItem('companion-role', String(user.role).toLowerCase());
      }),
      catchError(() => {
        this.clearSession();
        return of(null);
      })
    );
  }

  private storeSession(response: any) {
    localStorage.setItem('companion-token', response.token);
    localStorage.setItem('companion-role', String(response.role).toLowerCase());
    this.userSubject.next({
      id: response.userId,
      fullName: response.fullName,
      email: response.email,
      role: String(response.role).toLowerCase(),
      status: 'ACTIVE'
    });
  }

  dashboard(role: Role) {
    localStorage.setItem('companion-role', role);
    this.router.navigateByUrl(role === 'admin' ? '/admin' : role === 'companion' ? '/companion' : '/user');
  }

  logout() {
    this.clearSession();
    this.router.navigateByUrl('/');
  }

  private clearSession() {
    localStorage.removeItem('companion-token');
    localStorage.removeItem('companion-role');
    this.userSubject.next(null);
  }
}
