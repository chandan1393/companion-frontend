import { ActivatedRoute } from '@angular/router';
import { Component } from '@angular/core';
import { ApiService } from '../core/api.service';
import { AppService } from '../app.service';

@Component({
  standalone: false,
  selector: 'app-user-dashboard',
  templateUrl: './user-dashboard.component.html',
  styleUrls: ['./user-dashboard.component.css']
})
export class UserDashboardComponent {
  section = 'home';
  stats: any[] = [];
  bookings: any[] = [];
  rec: any[] = [];
  messages: any[] = [];
  payments: any[] = [];
  user: any = null;
  favorites: any[] = [];
  activities: any[] = [];
  unreadMessages = 0;
  selectedOtherUserId = 0;
  conversation: any[] = [];
  draftMessage = '';
  loading = true;
  error = '';
  editProfile = false;
  profileName = '';
  phone = '';
  city = '';

  constructor(private route: ActivatedRoute, private api: ApiService, private app: AppService) {
    this.route.data.subscribe((d: any) => { this.section = d['section'] || 'home'; this.load(); });
    this.route.queryParamMap.subscribe((q: any) => { const userId = Number(q.get('userId')); if (userId) { this.selectedOtherUserId = userId; this.section = 'messages'; setTimeout(() => this.loadConversation(userId)); } });
  }

  load() {
    this.loading = true;
    this.error = '';
    this.api.myUser().subscribe({
      next: u => { this.user = u; this.profileName = u.fullName; this.phone = u.phone || ''; this.city = u.city || ''; },
      error: e => this.error = e?.error?.message || 'Unable to load your profile.'
    });
    this.api.myBookings().subscribe({
      next: p => { this.bookings = (p.content || []).map(b => this.mapBooking(b)); this.rebuildActivity(); },
      error: e => this.error = e?.error?.message || 'Unable to load bookings.'
    });
    this.api.favorites().subscribe({
      next: f => { this.favorites = f || []; this.rec = this.favorites.slice(0, 4).map(x => this.mapRec(x)); },
      error: e => this.error = e?.error?.message || 'Unable to load favorites.'
    });
    this.api.messages().subscribe({
      next: p => { this.messages = p.content || []; this.unreadMessages = this.messages.filter(m => !m.readAt && m.recipientId === this.user?.id).length; this.rebuildActivity(); },
      error: e => this.error = e?.error?.message || 'Unable to load messages.'
    });
    this.api.payments().subscribe({
      next: p => { this.payments = (p.content || []).map((x: any) => { const booking = this.bookings.find((b: any) => b.id === x.bookingId); return { ...x, d: booking?.bookingDate || '', e: `Booking #${x.bookingId}`, a: x.amount, s: x.status }; }); this.rebuildActivity(); },
      error: e => this.error = e?.error?.message || 'Unable to load payments.'
    });
    this.api.customerDashboard().subscribe({
      next: d => {
        this.stats = [
          { n: d.totalBookings || 0, t: 'Total bookings', a: 'View all', link: '/user/bookings' },
          { n: d.completedBookings || 0, t: 'Completed', a: 'View all', link: '/user/bookings' },
          { n: d.favorites || 0, t: 'Favorites', a: 'View all', link: '/user/favorites' },
          { n: d.unreadMessages || 0, t: 'Unread messages', a: 'Open', link: '/user/messages' }
        ];
        this.unreadMessages = Number(d.unreadMessages || 0);
        this.loading = false;
      },
      error: e => { this.error = e?.error?.message || 'Unable to load dashboard.'; this.loading = false; }
    });
  }

  private mapBooking(b: any) {
    return { ...b, d: new Date(b.bookingDate).getDate(), m: new Date(b.bookingDate).toLocaleDateString('en-IN', { month: 'short' }), e: b.experienceTitle, name: b.companionName, time: `${this.time(b.startTime)} – ${this.time(b.endTime)}`, place: b.location, s: b.status };
  }
  private mapRec(p: any) { return { id: p.id, i: (p.displayName || '?').charAt(0), n: p.displayName, a: p.age, r: Number(p.rating || 0).toFixed(1), city: p.city }; }
  private time(t: string) { return t ? new Date(`1970-01-01T${t}`).toLocaleTimeString('en-IN', { hour: 'numeric', minute: '2-digit' }) : ''; }
  private relative(v: string) { if (!v) return ''; const mins = Math.max(1, Math.floor((Date.now() - new Date(v).getTime()) / 60000)); return mins < 60 ? `${mins}m` : mins < 1440 ? `${Math.floor(mins / 60)}h` : `${Math.floor(mins / 1440)}d`; }

  private rebuildActivity() {
    const rows: any[] = [];
    this.payments.slice(0, 3).forEach(p => rows.push({ icon: '💳', text: `Payment ${String(p.status).toLowerCase()}`, time: this.relative(p.d) }));
    this.messages.slice(0, 3).forEach(m => rows.push({ icon: '💬', text: `Message from ${m.senderId === this.user?.id ? m.recipientName : m.senderName}`, time: this.relative(m.createdAt) }));
    this.bookings.slice(0, 3).forEach(b => rows.push({ icon: '▣', text: `Booking ${String(b.s).toLowerCase()} · ${b.e}`, time: b.bookingDate }));
    this.activities = rows.slice(0, 6);
  }

  private loadConversation(userId: number) { this.selectedOtherUserId = userId; this.api.conversation(userId).subscribe({ next: list => this.conversation = list || [], error: e => this.error = e?.error?.message || 'Unable to load conversation.' }); }

  openConversation(m: any) {
    const other = m.senderId === this.user?.id ? m.recipientId : m.senderId;
    this.selectedOtherUserId = other;
    this.api.conversation(other).subscribe({
      next: list => { this.conversation = list || []; (list || []).filter(x => x.recipientId === this.user?.id && !x.readAt).forEach(x => this.api.markMessageRead(x.id).subscribe()); }
    });
  }

  sendMessage() {
    const text = this.draftMessage.trim();
    if (!text || !this.selectedOtherUserId) return;
    this.api.sendMessage(this.selectedOtherUserId, text).subscribe({
      next: m => { this.conversation = [...this.conversation, m]; this.draftMessage = ''; this.loadMessagesOnly(); },
      error: e => this.error = e?.error?.message || 'Unable to send message.'
    });
  }

  private loadMessagesOnly() {
    this.api.messages().subscribe({ next: p => this.messages = p.content || [] });
    this.api.unreadCount().subscribe({ next: n => this.unreadMessages = Number(n || 0) });
  }

  removeFavorite(id: number) {
    this.api.removeFavorite(id).subscribe({ next: () => { this.favorites = this.favorites.filter(x => x.id !== id); this.rec = this.favorites.slice(0, 4).map(x => this.mapRec(x)); } });
  }

  saveProfile() {
    this.api.updateUser({ fullName: this.profileName.trim(), phone: this.phone.trim(), city: this.city.trim() }).subscribe({
      next: u => { this.user = u; this.editProfile = false; },
      error: e => this.error = e?.error?.message || 'Unable to update profile.'
    });
  }

  logout() { this.app.logout(); }
  get title() { return ({ bookings: 'My Bookings', favorites: 'Favorites', messages: 'Messages', payments: 'Payments', profile: 'My Profile', settings: 'Account Settings', help: 'Help & Support' } as any)[this.section] || ''; }
  get subtitle() { return ({ bookings: 'Manage your upcoming and past experiences.', favorites: 'People and experiences you saved.', messages: 'Stay connected with your companions.', payments: 'Your secure payment history.', profile: 'Update your personal information.', settings: 'Your account details and security.', help: 'We are here when you need us.' } as any)[this.section] || ''; }
}
