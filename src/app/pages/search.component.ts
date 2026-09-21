import { ActivatedRoute } from '@angular/router';
import { AppService } from '../app.service';
import {Component} from '@angular/core';import {ApiService} from '../core/api.service';@Component({
  standalone: false,
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css']
})
export class SearchComponent{
  loggedIn = !!localStorage.getItem('companion-token');
  currentName = '';
  currentRole = '';

  get dashboardLink() {
    return this.currentRole === 'admin' ? '/admin' : this.currentRole === 'companion' ? '/companion' : '/user';
  }
  mode='companions'; pageTitle='Find your perfect companion'; pageSubtitle='Search verified companions by city and interests.'; profiles:any[]=[]; experienceList:any[]=[]; query=''; city=''; interest=''; loading=true; error='';
  constructor(private route:ActivatedRoute,private api:ApiService,public app:AppService){
    this.app.user$.subscribe(u => {
      this.loggedIn = !!localStorage.getItem('companion-token');
      this.currentName = u?.fullName || '';
      this.currentRole = String(u?.role || localStorage.getItem('companion-role') || '').toLowerCase();
    });
    this.route.data.subscribe((d: any)=>{this.mode=d['mode']||'companions'; this.updatePageCopy(); this.load()});
  }
  private updatePageCopy(){
    if(this.mode==='experiences'){
      this.pageTitle='Explore experiences';
      this.pageSubtitle='Browse activities, meetups and plans offered by verified companions.';
    } else if(this.mode==='companions'){
      this.pageTitle='Meet companions';
      this.pageSubtitle='Find people by city, interests and the kind of experience you want to share.';
    } else {
      this.pageTitle='Discover Companion';
      this.pageSubtitle='Search people and experiences from one place.';
    }
  }
  load(){
    this.loading=true;this.error='';
    if(this.mode==='experiences'){
      this.api.experiences(0,50).subscribe({next:p=>{this.experienceList=p.content||[];this.loading=false},error:e=>{this.error=e?.error?.message||'Unable to load experiences.';this.loading=false}});
    }else{
      this.api.companions(this.city||undefined,0,50).subscribe({next:p=>{this.profiles=(p.content||[]).map(x=>this.mapProfile(x));this.loading=false},error:e=>{this.error=e?.error?.message||'Unable to load companions.';this.loading=false}});
    }
  }
  search(){this.load()}
  get filteredProfiles(){const q=this.query.trim().toLowerCase();return this.profiles.filter(p=>(!q||`${p.n} ${p.d} ${p.tags.join(' ')}`.toLowerCase().includes(q))&&(!this.interest||p.tags.includes(this.interest)))}
  get filteredExperiences(){const q=this.query.trim().toLowerCase();return this.experienceList.filter(e=>!q||`${e.title} ${e.description} ${e.companionName} ${e.category||''}`.toLowerCase().includes(q))}
  private mapProfile(x:any){return{id:x.id,n:x.displayName,age:x.age,city:x.city,r:Number(x.rating||0).toFixed(1),rv:x.reviewCount||0,price:x.hourlyRate||0,d:x.bio||x.tagline||'Verified companion ready to share a great experience.',tags:x.interests||[],bg:'linear-gradient(135deg,#b87d60,#e7c5a4)'}}
}
