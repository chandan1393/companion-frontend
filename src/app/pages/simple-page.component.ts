import { ActivatedRoute } from '@angular/router';
import { Component } from '@angular/core';
import { AppService } from '../app.service';

@Component({
  standalone: false,
  selector: 'app-simple-page',
  templateUrl: './simple-page.component.html',
  styleUrls: ['./simple-page.component.css']
})
export class SimplePageComponent {
  page = '';
  title = '';
  subtitle = '';
  icon = '✦';
  cards: any[] = [];
  loggedIn = !!localStorage.getItem('companion-token');
  currentName = '';
  currentRole = '';

  get dashboardLink(): string {
    return this.currentRole === 'admin' ? '/admin' : this.currentRole === 'companion' ? '/companion' : '/user';
  }

  constructor(private route: ActivatedRoute, public app: AppService) {
    this.app.user$.subscribe(u => {
      this.loggedIn = !!localStorage.getItem('companion-token');
      this.currentName = u?.fullName || '';
      this.currentRole = String(u?.role || localStorage.getItem('companion-role') || '').toLowerCase();
    });
    this.route.data.subscribe((d: any) => {
      this.page = d['page'] || 'about';
      this.title = d['title'] || '';
      this.subtitle = d['subtitle'] || '';
      this.icon = d['icon'] || '✦';
      this.cards = this.page === 'safety' ? [
        { i: '✓', t: 'Verified profiles', d: 'Profiles can be reviewed before you decide who to contact or book.' },
        { i: '🔒', t: 'Secure booking flow', d: 'See the experience, price, date and booking details before confirmation.' },
        { i: '🚩', t: 'Report & block', d: 'Use platform controls to report inappropriate behaviour or block another user.' },
        { i: '💬', t: 'Keep communication on-platform', d: 'Use Companion messaging so important booking conversations stay connected to your account.' },
        { i: '📋', t: 'Community standards', d: 'Respect boundaries, communicate clearly and follow the rules for every experience.' },
        { i: '☎', t: 'Support', d: 'Contact support when you need help with a booking or account issue.' }
      ] : [
        { i: '✦', t: 'Meaningful connections', d: 'Discover people and experiences around shared interests and plans.' },
        { i: '♟', t: 'For customers', d: 'Browse companions, compare experiences and manage bookings from one account.' },
        { i: '★', t: 'For companions', d: 'Create your profile, publish experiences and manage your availability.' },
        { i: '▣', t: 'Simple booking', d: 'Choose an experience, select a date and review the details before confirming.' },
        { i: '♡', t: 'Community first', d: 'The platform is designed around respectful communication and transparent experiences.' },
        { i: '→', t: 'Keep exploring', d: 'Start with Discover to find companions and experiences available on the platform.' }
      ];
    });
  }
}
