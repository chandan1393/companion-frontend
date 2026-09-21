import {Component} from '@angular/core';import {ApiService} from '../core/api.service';import {finalize} from 'rxjs';
@Component({
  standalone: false,
  selector: 'app-companion-profile',
  templateUrl: './companion-profile.component.html',
  styleUrls: ['./companion-profile.component.css']
})
export class CompanionProfileComponent{
  profile:any=null;name='';age=18;city='';gender='Other';about='';tagline='';hourlyRate=0;saved=false;loading=true;error='';
  photos:string[]=[];interests:string[]=[];selected=new Set<string>();
  constructor(private api:ApiService){this.load()}
  load(){
    this.api.myCompanion().subscribe({next:p=>{this.profile=p;this.name=p.displayName;this.age=p.age;this.city=p.city;this.gender=p.gender;this.about=p.bio||'';this.tagline=p.tagline||'';this.hourlyRate=p.hourlyRate;this.photos=p.photoUrls||[];this.interests=p.interests||[];this.selected=new Set(this.interests)},error:e=>{this.error=e?.error?.message||'Unable to load your companion profile.';this.loading=false},complete:()=>this.loading=false});
  }
  toggle(x:string){this.selected.has(x)?this.selected.delete(x):this.selected.add(x)}
  save(){
    this.saved=false;this.error='';
    this.api.updateCompanion({displayName:this.name,age:Number(this.age),city:this.city,gender:this.gender,bio:this.about,tagline:this.tagline,hourlyRate:Number(this.hourlyRate)})
      .subscribe({next:p=>{this.profile=p;this.api.updateInterests([...this.selected]).subscribe({next:q=>{this.profile=q;this.saved=true},error:e=>this.error=e?.error?.message||'Profile saved, but interests could not be updated.'})},error:e=>this.error=e?.error?.message||'Unable to save profile.'});
  }
  remove(i:number){const url=this.photos[i];if(!url)return;this.api.removeCompanionPhoto(url).subscribe({next:p=>this.photos=p.photoUrls||[],error:e=>this.error=e?.error?.message||'Unable to remove photo.'})}
  upload(e:Event){
    const file=(e.target as HTMLInputElement).files?.[0];if(!file)return;
    if(file.size>5*1024*1024){this.error='Photo must be 5 MB or smaller.';return}
    this.api.uploadCompanionPhoto(file).subscribe({next:p=>this.photos=p.photoUrls||[],error:err=>this.error=err?.error?.message||'Unable to upload photo.'});
  }
  photoUrl(path:string){return this.api.assetUrl(path)}
}
