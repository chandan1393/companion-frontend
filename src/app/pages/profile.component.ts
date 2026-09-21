import { ActivatedRoute, Router } from '@angular/router';
import {Component} from '@angular/core';import {ApiService} from '../core/api.service';import { AppService } from '../app.service';@Component({
  standalone: false,
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent{
  loggedIn = !!localStorage.getItem('companion-token'); currentName=''; currentRole='';
  get dashboardLink(){return this.currentRole==='admin'?'/admin':this.currentRole==='companion'?'/companion':'/user';}
  profile:any=null; ex:any[]=[]; reviews:any[]=[]; selectedExperience:any=null; bookingDate=''; loading=true; error='';isFavorite=false;favoriteLoading=false;localLoggedIn=localStorage.getItem('companion-role')==='user';
  constructor(private route:ActivatedRoute,private router:Router,private api:ApiService,public app:AppService){
    this.app.user$.subscribe(u=>{this.loggedIn=!!localStorage.getItem('companion-token');this.currentName=u?.fullName||'';this.currentRole=String(u?.role||localStorage.getItem('companion-role')||'').toLowerCase();});
    this.route.paramMap.subscribe((p: any)=>{const id=Number(p.get('id'));if(id)this.load(id)});
  }
  load(id:number){
    this.loading=true;
    this.api.companion(id).subscribe({next:p=>{this.profile=p;this.bookingDate=this.tomorrow;this.loading=false;if(localStorage.getItem('companion-token'))this.api.favoriteExists(id).subscribe({next:v=>this.isFavorite=!!v,error:()=>{}})},error:e=>{this.error=e?.error?.message||'Unable to load profile.';this.loading=false}});
    this.api.companionExperiences(id).subscribe({next:x=>{this.ex=x;this.selectedExperience=x[0]||null}});
    this.api.companionReviews(id).subscribe({next:p=>this.reviews=p.content||[]});
  }
  get minDate(){return new Date().toISOString().slice(0,10)}
  get tomorrow(){const d=new Date();d.setDate(d.getDate()+1);return d.toISOString().slice(0,10)}
  continueBooking(){
    if(!this.profile||!this.selectedExperience||!this.bookingDate){this.error='Please select an experience and date.';return}
    this.router.navigate(['/booking',this.profile.id],{queryParams:{experienceId:this.selectedExperience.id,date:this.bookingDate}});
  }
  toggleFavorite(){if(!this.profile||!localStorage.getItem('companion-token')){this.error='Please log in to save companions.';return}this.favoriteLoading=true;const request=this.isFavorite?this.api.removeFavorite(this.profile.id):this.api.addFavorite(this.profile.id);request.subscribe({next:()=>{this.isFavorite=!this.isFavorite;this.favoriteLoading=false},error:e=>{this.error=e?.error?.message||'Unable to update favorites.';this.favoriteLoading=false}})}
  photoUrl(path:string){return this.api.assetUrl(path)}
}
