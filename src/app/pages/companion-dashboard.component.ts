import { ActivatedRoute } from '@angular/router';
import {Component} from '@angular/core';import {ApiService} from '../core/api.service';import {AppService} from '../app.service';@Component({
  standalone: false,
  selector: 'app-companion-dashboard',
  templateUrl: './companion-dashboard.component.html',
  styleUrls: ['./companion-dashboard.component.css']
})
export class CompanionDashboardComponent{
  section='home';stats:any[]=[];bookings:any[]=[];reviews:any[]=[];messages:any[]=[];experiences:any[]=[];profile:any=null;currentUserId=0;selectedOtherUserId=0;conversation:any[]=[];draftMessage='';earningsTotal=0;completedEarnings=0;upcomingEarnings=0;cancelledEarnings=0;
  week=['Mon','Tue','Wed','Thu','Fri','Sat','Sun'];slots=['9 AM','11 AM','1 PM','3 PM','5 PM','7 PM'];on=new Set<string>();slotIds=new Map<string,number>();
  publishedSlots:any[]=[]; availabilityDate=''; availabilityStart='09:00'; availabilityEnd='10:00'; savingAvailability=false; availabilityError='';
  settingsName=''; settingsCity=''; settingsRate=0; settingsTagline=''; settingsSaved=false;
  showExperienceForm=false;editingId=0;expTitle='';expDescription='';expPrice=0;expDuration=60;expCategory='Coffee';
  loading=true;error='';
  constructor(private route:ActivatedRoute,private api:ApiService,public app:AppService){
    this.route.data.subscribe((d: any)=>{this.section=d['section']||'home';this.load()});
  }
  load(){
    this.loading=true;this.error='';
    this.api.myCompanion().subscribe({next:p=>{this.profile=p;this.settingsName=p.displayName||'';this.settingsCity=p.city||'';this.settingsRate=Number(p.hourlyRate||0);this.settingsTagline=p.tagline||'';this.loadReviews(p.id);this.loadAvailability();},error:e=>this.error=e?.error?.message||'Unable to load companion profile.'});
    this.api.myUser().subscribe({next:u=>this.currentUserId=u.id});
    this.api.companionBookings().subscribe({next:p=>{this.bookings=(p.content||[]).map(b=>this.mapBooking(b));this.calculateEarnings();},error:e=>this.error=e?.error?.message||'Unable to load bookings.'});
    this.api.myExperiences().subscribe({next:x=>this.experiences=x||[],error:()=>{}});
    this.api.messages().subscribe({next:p=>this.messages=p.content||[],error:e=>this.error=e?.error?.message||'Unable to load messages.'});
    this.api.companionDashboard().subscribe({next:d=>{this.stats=[{n:d.upcomingBookings||0,t:'Upcoming bookings',a:'View all',link:'/companion/bookings'},{n:d.totalBookings||0,t:'Total bookings',a:'View details',link:'/companion/bookings'},{n:`₹${d.earnings||0}`,t:'Total earnings',a:'View earnings',link:'/companion/earnings'},{n:Number(d.rating||0).toFixed(1),t:'Average rating',a:'See reviews',link:'/companion/reviews'}];this.loading=false},error:e=>{this.error=e?.error?.message||'Unable to load dashboard.';this.loading=false}});
  }
  private mapBooking(b:any){return{...b,d:new Date(b.bookingDate).getDate(),m:new Date(b.bookingDate).toLocaleDateString('en-IN',{month:'short'}),e:b.experienceTitle,time:`${this.time(b.startTime)} – ${this.time(b.endTime)}`,place:b.location,c:b.customerName,s:b.status}}
  private calculateEarnings(){this.completedEarnings=this.bookings.filter(b=>b.s==='COMPLETED').reduce((n,b)=>n+Number(b.baseAmount||0),0);this.upcomingEarnings=this.bookings.filter(b=>b.s==='PENDING'||b.s==='CONFIRMED').reduce((n,b)=>n+Number(b.baseAmount||0),0);this.cancelledEarnings=this.bookings.filter(b=>b.s==='CANCELLED').reduce((n,b)=>n+Number(b.baseAmount||0),0);this.earningsTotal=this.completedEarnings+this.upcomingEarnings}
  private time(t:string){return t?new Date(`1970-01-01T${t}`).toLocaleTimeString('en-IN',{hour:'numeric',minute:'2-digit'}):''}
  private relative(v:string){const m=Math.max(1,Math.floor((Date.now()-new Date(v).getTime())/60000));return m<60?`${m}m`:m<1440?`${Math.floor(m/60)}h`:`${Math.floor(m/1440)}d`}
  private loadReviews(id:number){this.api.companionReviews(id,0,20).subscribe({next:p=>this.reviews=p.content||[],error:()=>{}})}
  loadAvailability(){
    if(!this.profile)return;
    const start=this.dateForDay(0),end=this.dateForDay(6);
    this.api.availability(start,end).subscribe({
      next:list=>{this.publishedSlots=list||[];this.on.clear();this.slotIds.clear();(list||[]).forEach(a=>{const key=this.keyFor(a.date,a.startTime);this.on.add(key);this.slotIds.set(key,a.id)})},
      error:e=>this.availabilityError=e?.error?.message||'Unable to load availability.'
    });
  }
  dateForDay(i:number){const d=new Date();const monday=new Date(d);const day=d.getDay();monday.setDate(d.getDate()-(day===0?6:day-1)+i);return monday.toISOString().slice(0,10)}
  timeForSlot(t:string){const map:any={'9 AM':'09:00:00','11 AM':'11:00:00','1 PM':'13:00:00','3 PM':'15:00:00','5 PM':'17:00:00','7 PM':'19:00:00'};return map[t]||'09:00:00'}
  keyFor(date:string,time:string){return `${date}|${time.slice(0,5)}`}
  toggle(d:string,t:string){
    const date=this.dateForDay(this.week.indexOf(d)), key=this.keyFor(date,this.timeForSlot(t));
    const id=this.slotIds.get(key);
    if(id){this.api.deleteAvailability(id).subscribe({next:()=>{this.on.delete(key);this.slotIds.delete(key);this.loadAvailability()},error:e=>this.error=e?.error?.message||'Unable to remove availability.'})}
    else{const start=this.timeForSlot(t);const end=new Date(`1970-01-01T${start}`).getTime()+60*60000;const endDate=new Date(end);const endTime=endDate.toTimeString().slice(0,8);this.api.createAvailability({date,startTime:start,endTime}).subscribe({next:a=>{this.on.add(key);this.slotIds.set(key,a.id);this.loadAvailability()},error:e=>this.error=e?.error?.message||'Unable to add availability.'})}
  }
  get minDate(){return new Date().toISOString().slice(0,10)}
  formatSlotTime(t:string){return this.time(t)}
  addCustomAvailability(){
    this.availabilityError='';
    if(!this.availabilityDate||!this.availabilityStart||!this.availabilityEnd){this.availabilityError='Choose a date, start time and end time.';return}
    if(this.availabilityEnd<=this.availabilityStart){this.availabilityError='End time must be after start time.';return}
    this.savingAvailability=true;
    this.api.createAvailability({date:this.availabilityDate,startTime:this.availabilityStart+':00',endTime:this.availabilityEnd+':00'}).subscribe({
      next:()=>{this.savingAvailability=false;this.availabilityDate='';this.availabilityStart='09:00';this.availabilityEnd='10:00';this.loadAvailability()},
      error:e=>{this.savingAvailability=false;this.availabilityError=e?.error?.message||'Unable to publish availability.'}
    });
  }
  removePublishedSlot(slot:any){this.api.deleteAvailability(slot.id).subscribe({next:()=>this.loadAvailability(),error:e=>this.availabilityError=e?.error?.message||'Unable to remove availability.'})}
  saveSettings(){
    this.settingsSaved=false;
    this.api.updateCompanion({displayName:this.settingsName.trim(),age:Number(this.profile?.age||18),city:this.settingsCity.trim(),gender:this.profile?.gender||'Other',bio:this.profile?.bio||'',tagline:this.settingsTagline.trim(),hourlyRate:Number(this.settingsRate)}).subscribe({
      next:p=>{this.profile=p;this.settingsSaved=true;setTimeout(()=>this.settingsSaved=false,2500)},
      error:e=>this.error=e?.error?.message||'Unable to save settings.'
    });
  }

  newExperience(){this.showExperienceForm=true;this.editingId=0;this.expTitle='';this.expDescription='';this.expPrice=0;this.expDuration=60;this.expCategory='Coffee'}
  editExperience(e:any){this.showExperienceForm=true;this.editingId=e.id;this.expTitle=e.title;this.expDescription=e.description;this.expPrice=e.price;this.expDuration=e.durationMinutes;this.expCategory=e.category||''}
  saveExperience(){
    const payload={title:this.expTitle,description:this.expDescription,price:Number(this.expPrice),durationMinutes:Number(this.expDuration),category:this.expCategory};
    const request=this.editingId?this.api.updateExperience(this.editingId,payload):this.api.createExperience(payload);
    request.subscribe({next:e=>{if(this.editingId){this.experiences=this.experiences.map(x=>x.id===e.id?e:x)}else this.experiences=[e,...this.experiences];this.showExperienceForm=false},error:err=>this.error=err?.error?.message||'Unable to save experience.'});
  }
  deleteExperience(e:any){if(!confirm(`Deactivate "${e.title}"?`))return;this.api.deleteExperience(e.id).subscribe({next:()=>this.experiences=this.experiences.filter(x=>x.id!==e.id),error:err=>this.error=err?.error?.message||'Unable to deactivate experience.'})}
  changeStatus(b:any,status:string){this.api.changeBookingStatus(b.id,status).subscribe({next:x=>{const mapped=this.mapBooking(x);this.bookings=this.bookings.map(v=>v.id===mapped.id?mapped:v);this.calculateEarnings()},error:e=>this.error=e?.error?.message||'Unable to update booking.'})}

  openConversation(m:any){const other=m.senderId===this.currentUserId?m.recipientId:m.senderId;this.selectedOtherUserId=other;this.api.conversation(other).subscribe({next:list=>{this.conversation=list||[];this.conversation.filter(x=>x.recipientId===this.currentUserId&&!x.readAt).forEach(x=>this.api.markMessageRead(x.id).subscribe())},error:e=>this.error=e?.error?.message||'Unable to load conversation.'})}
  sendMessage(){const text=this.draftMessage.trim();if(!text||!this.selectedOtherUserId)return;this.api.sendMessage(this.selectedOtherUserId,text).subscribe({next:m=>{this.conversation=[...this.conversation,m];this.draftMessage='';this.api.messages().subscribe({next:p=>this.messages=p.content||[]})},error:e=>this.error=e?.error?.message||'Unable to send message.'})}
  get title(){return ({bookings:'My Bookings',availability:'Availability',experiences:'My Experiences',earnings:'Earnings',reviews:'Reviews',messages:'Messages',settings:'Settings'} as any)[this.section]||''}
  get subtitle(){return ({bookings:'Manage customer requests and upcoming sessions.',availability:'Control when people can book you.',experiences:'Manage the experiences you offer.',earnings:'Track income and completed bookings.',reviews:'See what customers are saying about you.',messages:'Reply to customers and keep conversations organized.',settings:'Manage your companion account preferences.'} as any)[this.section]||''}
}
