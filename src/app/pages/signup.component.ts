import { ActivatedRoute } from '@angular/router';
import {Component} from '@angular/core';import {AppService,Role} from '../app.service';import {finalize} from 'rxjs';
@Component({
  standalone: false,
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent{name='';email='';password='';role:Role='user';error='';loading=false;constructor(private app:AppService,private route:ActivatedRoute){this.route.queryParamMap.subscribe((q: any)=>{this.name=q.get('name')||this.name;this.email=q.get('email')||this.email;this.role=(q.get('role') as Role)||this.role})}create(){this.error='';if(!this.name.trim()||!this.email.trim()||this.password.length<8){this.error='Please enter your name, a valid email and a password of at least 8 characters.';return}this.loading=true;this.app.register(this.name,this.email,this.password,this.role).pipe(finalize(()=>this.loading=false)).subscribe({next:()=>this.app.dashboard(this.app.role),error:e=>this.error=e?.error?.message||'Unable to create the account.'})}}
