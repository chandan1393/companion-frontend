import {Component} from '@angular/core';
import {ApiService} from '../core/api.service';
import { AppService } from '../app.service';

@Component({
  standalone: false,
  selector: 'app-landing',
  templateUrl: './landing.component.html',
  styleUrls: ['./landing.component.css']
})
export class LandingComponent{
  trust=[{i:'♟',t:'Verified People',d:'Authentic & safe community'},{i:'▣',t:'Secure Payments',d:'Hassle-free bookings'},{i:'◉',t:'Wide Range of Experiences',d:'Something for everyone'},{i:'♥',t:'Choose Your Vibe',d:'From coffee to adventures'},{i:'♧',t:'24/7 Support',d:"We're here for you"},{i:'▦',t:'Flexible & Easy',d:'Cancel or reschedule'},{i:'♥',t:'Real Connections',d:'More than just trips'}];
  steps=[{n:1,i:'⌕',t:'Search & Explore',d:'Find companions based on your interests, location and date.'},{n:2,i:'♟',t:'View Profiles',d:'Check ratings, reviews and interests before you connect.'},{n:3,i:'▦',t:'Book & Confirm',d:'Send a request, chat and confirm your plan.'},{n:4,i:'♥',t:'Meet & Enjoy',d:'Have a great time and create unforgettable memories.'}];
  categories=[
    {t:'Coffee & Conversations',d:'Relaxed coffee meetups with interesting people',img:'01-coffee-conversations.jpg'},
    {t:'Food & Dining',d:"Explore the city's best food spots together",img:'02-food-dining.jpg'},
    {t:'City Exploration',d:'Walks, landmarks and hidden gems',img:'03-city-exploration.jpg'},
    {t:'Outdoor & Adventure',d:'Trekking, hiking and nature trips',img:'04-outdoor-adventure.jpg'},
    {t:'Events & Concerts',d:'Music, art and live events together',img:'05-events-concerts.jpg'},
    {t:'Learning & Workshops',d:'Share skills and learn together',img:'06-learning-workshops.jpg'},
    {t:'Fitness & Wellness',d:'Yoga, gym, sports and healthy living',img:'07-fitness-wellness.jpg'},
    {t:'Travel & Getaways',d:'Weekend trips and destination travel',img:'08-travel-getaways.jpg'},
    {t:'Art & Culture',d:'Museums, exhibitions and cultural events',img:'09-art-culture.jpg'},
    {t:'Nightlife & Social',d:'Bars, lounges and social hangouts',img:'10-nightlife-social.jpg'},
    {t:'Shopping & Lifestyle',d:'Markets, malls and unique finds',img:'11-shopping-lifestyle.jpg'},
    {t:'Pets & Animals',d:'Pet walks, adoption events and more',img:'12-pets-animals.jpg'}
  ];
  benefits=[{i:'♧',t:'Curated & Verified Profiles',d:'Real people, real interests.'},{i:'▣',t:'Flexible Plans',d:'Last-minute or planned.'},{i:'★',t:'Interest-Based Matching',d:'Find people who vibe with you.'},{i:'♧',t:'Diverse Community',d:'Meet people from all walks of life.'},{i:'✓',t:'Safe & Secure',d:'Your safety is our priority.'},{i:'◉',t:'24/7 Support',d:'We’re always here to help.'}];
  reviews=[{i:'S',n:'Sneha K.',t:'I met amazing people on Companion and explored Delhi like never before! The whole experience was seamless and fun.',r:'5.0'},{i:'R',n:'Rohan P.',t:'From coffee meetups to weekend trips, I’ve made genuine connections here.',r:'4.8'},{i:'A',n:'Ananya S.',t:'A safe and trustworthy platform. I found travel buddies and friends for life!',r:'4.9'}];
  cities:any[]=[];
  loggedIn = !!localStorage.getItem('companion-token');
  currentName = '';
  currentRole = '';
  get dashboardLink(): string { return this.currentRole === 'admin' ? '/admin' : this.currentRole === 'companion' ? '/companion' : '/user'; }
  faqs=['Is Companion safe to use?','How are companions verified?','How do payments work?','Can I become a companion?','Can I cancel a booking?','Is there a mobile app?'];
  constructor(private api:ApiService, public app:AppService){
    this.app.user$.subscribe(u => {
      this.loggedIn = !!localStorage.getItem('companion-token');
      this.currentName = u?.fullName || '';
      this.currentRole = String(u?.role || localStorage.getItem('companion-role') || '').toLowerCase();
    });
    this.api.cities().subscribe({next:c=>this.cities=(c||[]).map((x:any)=>({n:x.name,c:`${x.companions}+`,bg:'linear-gradient(135deg,#d7bda9,#8ca6bd)'}))});
  }
}
