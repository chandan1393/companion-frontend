
import { Routes } from '@angular/router';
import { LandingComponent } from './pages/landing.component';
import { SearchComponent } from './pages/search.component';
import { ProfileComponent } from './pages/profile.component';
import { BookingComponent } from './pages/booking.component';
import { BookingDetailsComponent } from './pages/booking-details.component';
import { LoginComponent } from './pages/login.component';
import { SignupComponent } from './pages/signup.component';
import { BecomeCompanionComponent } from './pages/become-companion.component';
import { UserDashboardComponent } from './pages/user-dashboard.component';
import { CompanionDashboardComponent } from './pages/companion-dashboard.component';
import { CompanionProfileComponent } from './pages/companion-profile.component';
import { AdminDashboardComponent } from './pages/admin-dashboard.component';
import { AdminCompanionsComponent } from './pages/admin-companions.component';
import { SimplePageComponent } from './pages/simple-page.component';
import { authGuard, roleGuard } from './core/guards';

export const routes: Routes = [
  { path: '', component: LandingComponent },
  { path: 'search', component: SearchComponent },
  { path: 'experiences', component: SearchComponent, data: { mode: 'experiences' } },
  { path: 'companions', component: SearchComponent, data: { mode: 'companions' } },
  { path: 'profile/:id', component: ProfileComponent },
  { path: 'booking/:id', component: BookingComponent, canActivate: [authGuard] },
  { path: 'booking-details/:id', component: BookingDetailsComponent, canActivate: [authGuard] },
  { path: 'login', component: LoginComponent },
  { path: 'signup', component: SignupComponent },
  { path: 'become-companion', component: BecomeCompanionComponent },
  { path: 'safety', component: SimplePageComponent, data: { page: 'safety', title: 'Safety & Trust', subtitle: 'Clear standards, safer bookings and practical tools for a respectful community.', icon: '🛡️' } },
  { path: 'about', component: SimplePageComponent, data: { page: 'about', title: 'About Companion', subtitle: 'A people-first marketplace for meaningful company, local experiences and genuine connections.', icon: '✦' } },

  { path: 'user', component: UserDashboardComponent, canActivate: [roleGuard(['user'])] },
  { path: 'user/bookings', component: UserDashboardComponent, canActivate: [roleGuard(['user'])], data: { section: 'bookings' } },
  { path: 'user/favorites', component: UserDashboardComponent, canActivate: [roleGuard(['user'])], data: { section: 'favorites' } },
  { path: 'user/messages', component: UserDashboardComponent, canActivate: [roleGuard(['user'])], data: { section: 'messages' } },
  { path: 'user/payments', component: UserDashboardComponent, canActivate: [roleGuard(['user'])], data: { section: 'payments' } },
  { path: 'user/profile', component: UserDashboardComponent, canActivate: [roleGuard(['user'])], data: { section: 'profile' } },
  { path: 'user/settings', component: UserDashboardComponent, canActivate: [roleGuard(['user'])], data: { section: 'settings' } },
  { path: 'user/help', component: UserDashboardComponent, canActivate: [roleGuard(['user'])], data: { section: 'help' } },

  { path: 'companion', component: CompanionDashboardComponent, canActivate: [roleGuard(['companion'])] },
  { path: 'companion/bookings', component: CompanionDashboardComponent, canActivate: [roleGuard(['companion'])], data: { section: 'bookings' } },
  { path: 'companion/availability', component: CompanionDashboardComponent, canActivate: [roleGuard(['companion'])], data: { section: 'availability' } },
  { path: 'companion/experiences', component: CompanionDashboardComponent, canActivate: [roleGuard(['companion'])], data: { section: 'experiences' } },
  { path: 'companion/earnings', component: CompanionDashboardComponent, canActivate: [roleGuard(['companion'])], data: { section: 'earnings' } },
  { path: 'companion/reviews', component: CompanionDashboardComponent, canActivate: [roleGuard(['companion'])], data: { section: 'reviews' } },
  { path: 'companion/messages', component: CompanionDashboardComponent, canActivate: [roleGuard(['companion'])], data: { section: 'messages' } },
  { path: 'companion/profile', component: CompanionProfileComponent, canActivate: [roleGuard(['companion'])] },
  { path: 'companion/settings', component: CompanionDashboardComponent, canActivate: [roleGuard(['companion'])], data: { section: 'settings' } },

  { path: 'admin', component: AdminDashboardComponent, canActivate: [roleGuard(['admin'])] },
  { path: 'admin/companions', component: AdminCompanionsComponent, canActivate: [roleGuard(['admin'])] },
  { path: 'admin/users', component: AdminDashboardComponent, canActivate: [roleGuard(['admin'])], data: { section: 'users' } },
  { path: 'admin/bookings', component: AdminDashboardComponent, canActivate: [roleGuard(['admin'])], data: { section: 'bookings' } },
  { path: 'admin/reports', component: AdminDashboardComponent, canActivate: [roleGuard(['admin'])], data: { section: 'reports' } },
  { path: 'admin/settings', component: AdminDashboardComponent, canActivate: [roleGuard(['admin'])], data: { section: 'settings' } },
  { path: '**', redirectTo: '' }
];
