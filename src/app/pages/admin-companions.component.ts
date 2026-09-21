import {Component} from '@angular/core';import {ApiService} from '../core/api.service';import {AppService} from '../app.service';@Component({
  standalone: false,
  selector: 'app-admin-companions',
  templateUrl: './admin-companions.component.html',
  styleUrls: ['./admin-companions.component.css']
})
export class AdminCompanionsComponent{
  selected:any=null;companions:any[]=[];query='';status='';city='';loading=true;error='';
  constructor(private api:ApiService,public app:AppService){this.load()}
  load(){this.loading=true;this.api.adminCompanions().subscribe({next:p=>{this.companions=(p.content||[]).map(x=>({id:x.id,i:(x.displayName||'?').charAt(0),n:x.displayName,city:x.city,r:x.rating||0,s:x.status}));this.loading=false},error:e=>{this.error=e?.error?.message||'Unable to load companions.';this.loading=false}})}
  get filtered(){const q=this.query.toLowerCase().trim();return this.companions.filter(x=>(!q||`${x.n} ${x.city}`.toLowerCase().includes(q))&&(!this.status||x.s===this.status)&&(!this.city||x.city===this.city))}
  review(p:any){this.selected=p}
  change(p:any,status:string){this.api.changeCompanionStatus(p.id,status).subscribe({next:x=>{p.s=x.status;this.selected=p},error:e=>this.error=e?.error?.message||'Unable to update companion status.'})}
}
