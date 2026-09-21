# Companion Marketplace Angular UI — Complete Build

## Run

```powershell
npm install
ng serve
```

If port 4200 is already occupied:

```powershell
ng serve --port 4300
```

## Demo login

| Role | Email | Password | Dashboard |
|---|---|---|---|
| Customer | user@companion.demo | user123 | `/user` |
| Customer | rohan@companion.demo | user123 | `/user` |
| Customer | ananya@companion.demo | user123 | `/user` |
| Companion | companion@companion.demo | companion123 | `/companion` |
| Companion | arjun@companion.demo | companion123 | `/companion` |
| Companion | simran@companion.demo | companion123 | `/companion` |
| Companion | kabir@companion.demo | companion123 | `/companion` |
| Admin | admin@companion.demo | admin123 | `/admin` |

Login and registration are connected to the Spring Boot backend with JWT authentication and role-based route guards.

## All pages/routes

### Public
- `/` — landing page
- `/search` — discover/search
- `/experiences` — experiences
- `/companions` — companion directory
- `/profile/1` — companion profile
- `/booking/:companionId` — booking flow
- `/booking-details/:bookingId` — live booking/payment/review details
- `/become-companion` — companion application
- `/login` — login
- `/signup` — signup
- `/safety` — safety
- `/about` — about

### Customer dashboard
Every sidebar option is clickable:
- `/user` — Home
- `/user/bookings` — My Bookings
- `/user/favorites` — Favorites
- `/user/messages` — Messages
- `/user/payments` — Payments
- `/user/profile` — My Profile
- `/user/settings` — Settings
- `/user/help` — Help & Support

### Companion dashboard
Every sidebar option is clickable:
- `/companion` — Dashboard
- `/companion/bookings` — My Bookings
- `/companion/availability` — Availability
- `/companion/experiences` — My Experiences
- `/companion/earnings` — Earnings
- `/companion/reviews` — Reviews
- `/companion/messages` — Messages
- `/companion/profile` — Profile editor
- `/companion/settings` — Settings

The companion profile editor includes image upload, local image preview, remove photo, cover label, editable basic information and interest selection.

### Admin
Every sidebar option is clickable:
- `/admin` — Dashboard
- `/admin/companions` — Manage Companions
- `/admin/users` — Users
- `/admin/bookings` — Bookings
- `/admin/reports` — Reports & Analytics
- `/admin/settings` — Settings

## Important UI fixes in this version

1. No missing `hero-background.jpg` or `newsletter-background.jpg`. Backgrounds are local SVG files.
2. `CommonModule` is imported wherever `*ngIf`, `*ngFor` or `ngSwitch` is used.
3. Dashboard layouts use an explicit sidebar + main-content grid.
4. Landing page uses a 1440px desktop content system and larger readable typography.
5. The landing page has working Experiences and Companions links plus Login and Sign up.
6. Customer, companion and admin dashboard menu items all have Angular routes.
7. Authenticated dashboard data, bookings, payments, messages, favorites, reviews, companion management and admin data are loaded from the backend.
8. Booking payment uses the backend development mock-payment endpoint; replace it with the production payment provider before going live.

## Angular/TypeScript compatibility

This project uses Angular 20.2.x and TypeScript 5.9.x so the TypeScript compiler mismatch from the previous project is avoided.

Recommended Node.js: 20+.


## Backend integration

This Angular project is now connected to the Companion Spring Boot API.

- API base URL: `http://localhost:8080/api`
- Change it in `src/environments/environment.ts` for another backend host.
- JWT is stored in `localStorage` under `companion-token` and attached automatically as a Bearer token.
- Role-based routes are protected for customer, companion and admin dashboards.
- Public companion/experience discovery uses the backend instead of hard-coded profile data.
- Booking creates the booking through the API, creates a payment order, then uses the backend's **development mock payment confirmation** endpoint.
- Companion profile, photo upload/removal, interests, experiences and availability are connected to the API.
- Customer bookings, favorites, messages, payments and profile editing are connected.
- Admin users, companions, approvals/status changes and bookings are connected.

### Run

1. Start PostgreSQL and the Spring Boot backend.
2. Confirm the backend is available at `http://localhost:8080/api`.
3. In this Angular project run `npm install`.
4. Run `npm start`.
5. Open `http://localhost:4200`.

Demo accounts supplied by the backend:

- Customers: `user@companion.demo`, `rohan@companion.demo`, `ananya@companion.demo` / password `user123`
- Companions: `companion@companion.demo`, `arjun@companion.demo`, `simran@companion.demo`, `kabir@companion.demo` / password `companion123`
- Admin: `admin@companion.demo` / `admin123`

The payment screen intentionally uses the backend mock payment endpoint for development. A real Razorpay checkout should replace that step before production.


## Angular architecture
This version uses classic NgModule architecture. Each component has separate `.ts`, `.html`, and `.css` files under `src/app/pages`. The root module is `src/app/app.module.ts`.
