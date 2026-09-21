import { ActivatedRoute, Router } from '@angular/router';
import { Component } from '@angular/core';
import { ApiService } from '../core/api.service';
import { AppService } from '../app.service';

@Component({
  standalone: false,
  selector: 'app-booking-details',
  templateUrl: './booking-details.component.html',
  styleUrls: ['./booking-details.component.css']
})
export class BookingDetailsComponent {
  booking: any = null;
  payment: any = null;
  loading = true;
  saving = false;
  error = '';
  reviewRating = 5;
  reviewComment = '';
  reviewSaved = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private api: ApiService,
    public app: AppService
  ) {
    this.route.paramMap.subscribe((params: any) => {
      const id = Number(params.get('id'));
      if (id) this.load(id);
    });
  }

  load(id: number) {
    this.loading = true;
    this.error = '';
    this.api.booking(id).subscribe({
      next: booking => {
        this.booking = booking;
        this.api.paymentForBooking(id).subscribe({
          next: payment => this.payment = payment,
          error: () => this.payment = null
        });
        this.loading = false;
      },
      error: e => {
        this.error = e?.error?.message || 'Unable to load booking.';
        this.loading = false;
      }
    });
  }

  cancel() {
    if (!this.booking || !['PENDING', 'CONFIRMED'].includes(this.booking.status)) return;
    if (!confirm('Cancel this booking?')) return;
    this.saving = true;
    this.api.changeBookingStatus(this.booking.id, 'CANCELLED').subscribe({
      next: b => { this.booking = b; this.saving = false; },
      error: e => { this.error = e?.error?.message || 'Unable to cancel booking.'; this.saving = false; }
    });
  }

  submitReview() {
    if (!this.booking || this.booking.status !== 'COMPLETED' || !this.reviewComment.trim()) {
      this.error = 'Please add a review comment.';
      return;
    }
    this.saving = true;
    this.api.createReview({ bookingId: this.booking.id, rating: Number(this.reviewRating), comment: this.reviewComment.trim() }).subscribe({
      next: () => { this.reviewSaved = true; this.reviewComment = ''; this.saving = false; },
      error: e => { this.error = e?.error?.message || 'Unable to submit review.'; this.saving = false; }
    });
  }

  formatTime(t: string) {
    return t ? new Date(`1970-01-01T${t}`).toLocaleTimeString('en-IN', { hour: 'numeric', minute: '2-digit' }) : '';
  }

  back() {
    this.router.navigate(['/user/bookings']);
  }
}
