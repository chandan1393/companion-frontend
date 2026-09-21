import { ActivatedRoute } from '@angular/router';
import {Component} from '@angular/core';import {ApiService} from '../core/api.service';import {AppService} from '../app.service';
@Component({
  standalone: false,
  selector: 'app-admin-dashboard',
  templateUrl: './admin-dashboard.component.html',
  styleUrls: ['./admin-dashboard.component.css']
})
export class AdminDashboardComponent{
  section='home';stats:any[]=[];queue:any[]=[];rows:any[]=[];loading=true;error='';admin:any=null;
  constructor(private route:ActivatedRoute,private api:ApiService,public app:AppService){this.route.data.subscribe((d: any)=>{this.section=d['section']||'home';this.load()})}
  load(){
    this.loading=true;this.error='';
    this.api.myUser().subscribe({next:u=>this.admin=u,error:()=>{}});
    if(this.section==='home'){
      this.api.adminDashboard().subscribe({next:d=>{this.stats=[
        {i:'♙',n:d.users??0,t:'Registered users',c:''},{i:'♟',n:d.companions??0,t:'Companions',c:''},
        {i:'▣',n:d.bookings??0,t:'Bookings',c:''},{i:'✓',n:d.confirmedBookings??0,t:'Confirmed bookings',c:''}
      ];this.loading=false},error:e=>{this.error=e?.error?.message||'Unable to load admin dashboard.';this.loading=false}});
      this.api.adminCompanions().subscribe({next:p=>this.queue=(p.content||[]).filter(x=>String(x.status).toUpperCase()==='PENDING').slice(0,5).map(x=>({id:x.id,i:(x.displayName||'?').charAt(0),n:x.displayName,city:x.city,when:'recent'})),error:()=>{}});
    }else if(this.section==='users'){
      this.api.adminUsers().subscribe({next:p=>{this.rows=(p.content||[]).map(x=>({id:x.id,n:x.fullName,t:String(x.role).replace('USER','Customer').replace('COMPANION','Companion'),s:x.status}));this.loading=false},error:e=>{this.error=e?.error?.message||'Unable to load users.';this.loading=false}});
    }else if(this.section==='bookings'){
      this.api.adminBookings().subscribe({next:p=>{this.rows=(p.content||[]).map(x=>({id:x.id,n:`#${x.id} ${x.experienceTitle}`,t:x.customerName,s:x.status}));this.loading=false},error:e=>{this.error=e?.error?.message||'Unable to load bookings.';this.loading=false}});
    }else if(this.section==='reports'){
      this.api.adminDashboard().subscribe({next:d=>{this.rows=[
        {n:'Registered users',t:'Users',s:d.users||0},
        {n:'Verified/pending companions',t:'Companions',s:d.companions||0},
        {n:'Total bookings',t:'Bookings',s:d.bookings||0},
        {n:'Confirmed bookings',t:'Confirmed',s:d.confirmedBookings||0},
        {n:'Completed bookings',t:'Completed',s:d.completedBookings||0},
        {n:'Pending companion approvals',t:'Approvals',s:d.pendingCompanions||0}
      ];this.loading=false},error:e=>{this.error=e?.error?.message||'Unable to load reports.';this.loading=false}});
    }else if(this.section==='settings'){
      this.api.myUser().subscribe({next:u=>{this.admin=u;this.loading=false},error:e=>{this.error=e?.error?.message||'Unable to load admin account.';this.loading=false}});
    }else{
      this.loading=false;this.rows=[];
    }
  }
  manage(x:any){
    if(this.section==='users'){const next=String(x.s).toUpperCase()==='ACTIVE'?'BLOCKED':'ACTIVE';this.api.changeUserStatus(x.id,next).subscribe({next:u=>x.s=u.status,error:e=>this.error=e?.error?.message||'Unable to update user.'})}
  }
  approve(x:any){this.api.changeCompanionStatus(x.id,'VERIFIED').subscribe({next:()=>this.queue=this.queue.filter(q=>q.id!==x.id),error:e=>this.error=e?.error?.message||'Unable to approve companion.'})}
  get title(){return ({users:'Users',bookings:'Bookings',reports:'Reports & Analytics',settings:'Admin Settings'} as any)[this.section]||''}
  get desc(){return ({users:'Manage registered customer accounts.',bookings:'Review platform bookings and statuses.',reports:'Monitor marketplace activity and performance.',settings:'Configure admin preferences and platform controls.'} as any)[this.section]||''}
}
