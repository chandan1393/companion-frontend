import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';

import { AppComponent } from './app.component';
import { routes } from './app.routes';
import { authInterceptor } from './core/auth.interceptor';

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

@NgModule({
  declarations: [
    AppComponent,
    LandingComponent,
    SearchComponent,
    ProfileComponent,
    BookingComponent,
    BookingDetailsComponent,
    LoginComponent,
    SignupComponent,
    BecomeCompanionComponent,
    UserDashboardComponent,
    CompanionDashboardComponent,
    CompanionProfileComponent,
    AdminDashboardComponent,
    AdminCompanionsComponent,
    SimplePageComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    RouterModule.forRoot(routes, { scrollPositionRestoration: 'enabled', anchorScrolling: 'enabled' })
  ],
  providers: [
    provideHttpClient(withInterceptors([authInterceptor])),
    provideAnimationsAsync()
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
