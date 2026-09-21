import {Component} from '@angular/core';import {AppService} from '../app.service';import {finalize} from 'rxjs';
@Component({
  standalone: false,
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent{email='user@companion.demo';password='user123';error='';loading=false;constructor(private app:AppService){}fill(kind:string){const a=this.app.accounts.find(x=>kind==='user'?x.email==='user@companion.demo':kind==='user2'?x.email==='rohan@companion.demo':kind==='companion'?x.email==='companion@companion.demo':kind==='companion2'?x.email==='arjun@companion.demo':kind==='companion3'?x.email==='simran@companion.demo':x.role==='admin');if(a){this.email=a.email;this.password=a.password}}login(){this.error='';this.loading=true;this.app.login(this.email,this.password).pipe(finalize(()=>this.loading=false)).subscribe({next:()=>this.app.dashboard(this.app.role),error:e=>this.error=e?.error?.message||'Login failed. Check your email and password.'})}}
