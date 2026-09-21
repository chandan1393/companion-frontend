
import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { environment } from '../../environments/environment';
import { ApiResponse, PageResponse, Companion, Experience, Availability, Booking, Review, Message, Payment, User, DashboardData } from './models';

@Injectable({ providedIn: 'root' })
export class ApiService {
  private readonly http = inject(HttpClient);
  readonly baseUrl = environment.apiUrl;

  private unwrap<T>(source: Observable<ApiResponse<T>>): Observable<T> {
    return source.pipe(map(response => response.data));
  }

  private pageParams(page = 0, size = 12, extra: Record<string, string | number | undefined> = {}): HttpParams {
    let params = new HttpParams().set('page', page).set('size', size);
    Object.entries(extra).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') params = params.set(key, String(value));
    });
    return params;
  }

  login(payload: { email: string; password: string }) {
    return this.unwrap(this.http.post<ApiResponse<any>>(`${this.baseUrl}/auth/login`, payload));
  }
  register(payload: { fullName: string; email: string; password: string; role: string }) {
    return this.unwrap(this.http.post<ApiResponse<any>>(`${this.baseUrl}/auth/register`, payload));
  }
  me() { return this.unwrap(this.http.get<ApiResponse<any>>(`${this.baseUrl}/auth/me`)); }

  companions(city?: string, page = 0, size = 12) {
    return this.unwrap(this.http.get<ApiResponse<PageResponse<Companion>>>(`${this.baseUrl}/public/companions`, {
      params: this.pageParams(page, size, { city })
    }));
  }
  companion(id: number) { return this.unwrap(this.http.get<ApiResponse<Companion>>(`${this.baseUrl}/public/companions/${id}`)); }
  companionExperiences(id: number) {
    return this.unwrap(this.http.get<ApiResponse<Experience[]>>(`${this.baseUrl}/public/companions/${id}/experiences`));
  }
  companionReviews(id: number, page = 0, size = 10) {
    return this.unwrap(this.http.get<ApiResponse<PageResponse<Review>>>(`${this.baseUrl}/public/companions/${id}/reviews`, {
      params: this.pageParams(page, size)
    }));
  }
  experiences(page = 0, size = 12) {
    return this.unwrap(this.http.get<ApiResponse<PageResponse<Experience>>>(`${this.baseUrl}/public/experiences`, {
      params: this.pageParams(page, size)
    }));
  }
  cities() { return this.unwrap(this.http.get<ApiResponse<any[]>>(`${this.baseUrl}/public/cities`)); }
  categories() { return this.unwrap(this.http.get<ApiResponse<string[]>>(`${this.baseUrl}/public/categories`)); }

  myUser() { return this.unwrap(this.http.get<ApiResponse<User>>(`${this.baseUrl}/users/me`)); }
  updateUser(payload: { fullName: string; phone?: string; city?: string }) {
    return this.unwrap(this.http.put<ApiResponse<User>>(`${this.baseUrl}/users/me`, payload));
  }

  myCompanion() { return this.unwrap(this.http.get<ApiResponse<Companion>>(`${this.baseUrl}/companion/profile`)); }
  updateCompanion(payload: any) {
    return this.unwrap(this.http.put<ApiResponse<Companion>>(`${this.baseUrl}/companion/profile`, payload));
  }
  updateInterests(interests: string[]) {
    return this.unwrap(this.http.put<ApiResponse<Companion>>(`${this.baseUrl}/companion/profile/interests`, { interests }));
  }
  uploadCompanionPhoto(file: File) {
    const form = new FormData(); form.append('file', file);
    return this.unwrap(this.http.post<ApiResponse<Companion>>(`${this.baseUrl}/companion/profile/photos/upload`, form));
  }
  removeCompanionPhoto(photoUrl: string) {
    return this.unwrap(this.http.delete<ApiResponse<Companion>>(`${this.baseUrl}/companion/profile/photos`, { params: { photoUrl } }));
  }

  myExperiences() { return this.unwrap(this.http.get<ApiResponse<Experience[]>>(`${this.baseUrl}/companion/experiences`)); }
  createExperience(payload: any) {
    return this.unwrap(this.http.post<ApiResponse<Experience>>(`${this.baseUrl}/companion/experiences`, payload));
  }
  updateExperience(id: number, payload: any) {
    return this.unwrap(this.http.put<ApiResponse<Experience>>(`${this.baseUrl}/companion/experiences/${id}`, payload));
  }
  deleteExperience(id: number) {
    return this.unwrap(this.http.delete<ApiResponse<void>>(`${this.baseUrl}/companion/experiences/${id}`));
  }

  availability(from: string, to: string, companionId?: number) {
    const url = companionId
      ? `${this.baseUrl}/public/companions/${companionId}/availability`
      : `${this.baseUrl}/companion/availability`;
    return this.unwrap(this.http.get<ApiResponse<Availability[]>>(url, { params: { from, to } }));
  }
  createAvailability(payload: { date: string; startTime: string; endTime: string }) {
    return this.unwrap(this.http.post<ApiResponse<Availability>>(`${this.baseUrl}/companion/availability`, payload));
  }
  deleteAvailability(id: number) {
    return this.unwrap(this.http.delete<ApiResponse<void>>(`${this.baseUrl}/companion/availability/${id}`));
  }

  createBooking(payload: any) {
    return this.unwrap(this.http.post<ApiResponse<Booking>>(`${this.baseUrl}/bookings`, payload));
  }
  myBookings(page = 0, size = 30) {
    return this.unwrap(this.http.get<ApiResponse<PageResponse<Booking>>>(`${this.baseUrl}/bookings/mine`, { params: this.pageParams(page, size) }));
  }
  companionBookings(page = 0, size = 30) {
    return this.unwrap(this.http.get<ApiResponse<PageResponse<Booking>>>(`${this.baseUrl}/bookings/companion`, { params: this.pageParams(page, size) }));
  }
  booking(id: number) { return this.unwrap(this.http.get<ApiResponse<Booking>>(`${this.baseUrl}/bookings/${id}`)); }
  changeBookingStatus(id: number, status: string) {
    return this.unwrap(this.http.patch<ApiResponse<Booking>>(`${this.baseUrl}/bookings/${id}/status`, { status }));
  }

  favorites() { return this.unwrap(this.http.get<ApiResponse<Companion[]>>(`${this.baseUrl}/favorites`)); }
  addFavorite(id: number) { return this.unwrap(this.http.post<ApiResponse<void>>(`${this.baseUrl}/favorites/${id}`, {})); }
  removeFavorite(id: number) { return this.unwrap(this.http.delete<ApiResponse<void>>(`${this.baseUrl}/favorites/${id}`)); }
  favoriteExists(id: number) { return this.unwrap(this.http.get<ApiResponse<boolean>>(`${this.baseUrl}/favorites/${id}/exists`)); }

  messages(page = 0, size = 30) {
    return this.unwrap(this.http.get<ApiResponse<PageResponse<Message>>>(`${this.baseUrl}/messages`, { params: this.pageParams(page, size) }));
  }
  conversation(otherUserId: number) {
    return this.unwrap(this.http.get<ApiResponse<Message[]>>(`${this.baseUrl}/messages/conversation/${otherUserId}`));
  }
  sendMessage(recipientId: number, content: string) {
    return this.unwrap(this.http.post<ApiResponse<Message>>(`${this.baseUrl}/messages`, { recipientId, content }));
  }
  markMessageRead(id: number) {
    return this.unwrap(this.http.patch<ApiResponse<void>>(`${this.baseUrl}/messages/${id}/read`, {}));
  }
  unreadCount() { return this.unwrap(this.http.get<ApiResponse<number>>(`${this.baseUrl}/messages/unread-count`)); }

  payments(page = 0, size = 20) {
    return this.unwrap(this.http.get<ApiResponse<PageResponse<Payment>>>(`${this.baseUrl}/payments/mine`, { params: this.pageParams(page, size) }));
  }
  paymentForBooking(id: number) {
    return this.unwrap(this.http.get<ApiResponse<Payment>>(`${this.baseUrl}/payments/booking/${id}`));
  }
  createPaymentOrder(id: number) {
    return this.unwrap(this.http.post<ApiResponse<Payment>>(`${this.baseUrl}/payments/booking/${id}/order`, {}));
  }
  confirmMockPayment(id: number, providerPaymentId: string) {
    return this.unwrap(this.http.post<ApiResponse<Payment>>(`${this.baseUrl}/payments/booking/${id}/confirm-mock`, { providerPaymentId }));
  }

  createReview(payload: { bookingId: number; rating: number; comment: string }) {
    return this.unwrap(this.http.post<ApiResponse<Review>>(`${this.baseUrl}/reviews`, payload));
  }

  customerDashboard() { return this.unwrap(this.http.get<ApiResponse<DashboardData>>(`${this.baseUrl}/dashboard/customer`)); }
  companionDashboard() { return this.unwrap(this.http.get<ApiResponse<DashboardData>>(`${this.baseUrl}/dashboard/companion`)); }

  adminDashboard() { return this.unwrap(this.http.get<ApiResponse<DashboardData>>(`${this.baseUrl}/admin/dashboard`)); }
  adminUsers(page = 0) {
    return this.unwrap(this.http.get<ApiResponse<PageResponse<any>>>(`${this.baseUrl}/admin/users`, { params: this.pageParams(page, 25) }));
  }
  adminCompanions(page = 0) {
    return this.unwrap(this.http.get<ApiResponse<PageResponse<any>>>(`${this.baseUrl}/admin/companions`, { params: this.pageParams(page, 25) }));
  }
  adminBookings(page = 0) {
    return this.unwrap(this.http.get<ApiResponse<PageResponse<any>>>(`${this.baseUrl}/admin/bookings`, { params: this.pageParams(page, 25) }));
  }
  changeUserStatus(id: number, status: string) {
    return this.unwrap(this.http.patch<ApiResponse<any>>(`${this.baseUrl}/admin/users/${id}/status`, null, { params: { status } }));
  }
  changeCompanionStatus(id: number, status: string) {
    return this.unwrap(this.http.patch<ApiResponse<Companion>>(`${this.baseUrl}/admin/companions/${id}/status`, null, { params: { status } }));
  }

  assetUrl(path?: string | null): string {
    if (!path) return '';
    return path.startsWith('http') ? path : `${this.baseUrl.replace('/api', '')}${path}`;
  }
}
