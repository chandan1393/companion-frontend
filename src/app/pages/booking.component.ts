import { ActivatedRoute, Router } from '@angular/router';
import {Component} from '@angular/core';import {ApiService} from '../core/api.service';import {finalize} from 'rxjs';
@Component({
  standalone: false,
  selector: 'app-booking',
  templateUrl: './booking.component.html',
  styleUrls: ['./booking.component.css']
})

export class BookingComponent{
  companion:any=null;experiences:any[]=[];availability:any[]=[];selectedExperience:any=null;
  bookingDate='';selectedTime='';location='';customerNote='';paid=false;loading=true;submitting=false;error='';
  constructor(private route:ActivatedRoute,public api:ApiService,private router:Router){
    this.route.paramMap.subscribe((p: any)=>{const id=Number(p.get('id'));if(id)this.load(id)});
    this.route.queryParamMap.subscribe((q: any)=>{const date=q.get('date');const exp=Number(q.get('experienceId'));if(date)this.bookingDate=date; if(exp)this.selectedExperienceId=exp});
  }
  private selectedExperienceId=0;
  get minDate(){return new Date().toISOString().slice(0,10)}
  get fee(){return Math.round(Number(this.selectedExperience?.price||0)*0.1)}
  get total(){return Number(this.selectedExperience?.price||0)+this.fee}
  load(id:number){
    this.loading=true;
    this.api.companion(id).subscribe({next:c=>{this.companion=c;this.api.companionExperiences(id).subscribe({next:es=>{this.experiences=es;this.selectedExperience=es.find(x=>x.id===this.selectedExperienceId)||es[0]||null;if(!this.bookingDate)this.findFirstAvailableDate();else this.loadAvailability()}})},error:e=>{this.error=e?.error?.message||'Unable to load companion.';this.loading=false}});
  }
  findFirstAvailableDate(){
    const from=this.minDate;const endDate=new Date();endDate.setDate(endDate.getDate()+180);const to=endDate.toISOString().slice(0,10);
    this.api.availability(from,to,this.companion.id).subscribe({next:list=>{
      const first=(list||[])[0];
      if(first){this.bookingDate=first.date;this.availability=list||[];this.selectedTime=first.startTime;this.loading=false}
      else {this.bookingDate=from;this.loadAvailability()}
    },error:()=>{this.bookingDate=from;this.loadAvailability()}});
  }
  loadAvailability(){
    if(!this.companion||!this.bookingDate)return;
    this.selectedTime='';
    this.api.availability(this.bookingDate,this.bookingDate,this.companion.id).subscribe({next:a=>{this.availability=a||[];this.loading=false},error:e=>{this.availability=[];this.loading=false;this.error=e?.error?.message||'Unable to load availability.'}});
  }
  formatTime(value:string){return value?new Date(`1970-01-01T${value}`).toLocaleTimeString('en-IN',{hour:'numeric',minute:'2-digit'}):''}
  createBooking(){
    this.error='';
    if(!this.selectedExperience||!this.bookingDate||!this.selectedTime||!this.location.trim()){this.error='Select an experience, available time, date and meeting location.';return}
    this.submitting=true;
    this.api.createBooking({companionId:this.companion.id,experienceId:this.selectedExperience.id,bookingDate:this.bookingDate,startTime:this.selectedTime,location:this.location.trim(),customerNote:this.customerNote.trim()}).subscribe({
      next:b=>this.api.createPaymentOrder(b.id).subscribe({
        next:()=>this.api.confirmMockPayment(b.id,`mock_${Date.now()}`).pipe(finalize(()=>this.submitting=false)).subscribe({
          next:()=>{this.paid=true;setTimeout(()=>this.router.navigate(['/user/bookings']),900)},
          error:e=>{this.error=e?.error?.message||'Payment confirmation failed.'}
        }),
        error:e=>{this.submitting=false;this.error=e?.error?.message||'Unable to create payment order.'}
      }),
      error:e=>{this.submitting=false;this.error=e?.error?.message||'Unable to create booking.'}
    });
  }
}
