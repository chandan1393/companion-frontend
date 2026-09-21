import { Router } from '@angular/router';
import {Component} from '@angular/core';
import { AppService } from '../app.service';@Component({
  standalone: false,
  selector: 'app-become-companion',
  templateUrl: './become-companion.component.html',
  styleUrls: ['./become-companion.component.css']
})
export class BecomeCompanionComponent{
  loggedIn=!!localStorage.getItem('companion-token'); currentName=''; currentRole='';
  get dashboardLink(){return this.currentRole==='admin'?'/admin':this.currentRole==='companion'?'/companion':'/user';}
  why=[
    {i:'◷',t:'Flexible schedule',d:'Choose when you want to host experiences and keep control of your time.'},
    {i:'₹',t:'Earn on your terms',d:'Turn your interests and local knowledge into bookable experiences.'},
    {i:'♟',t:'Meet new people',d:'Connect with customers who are looking for meaningful experiences.'},
    {i:'★',t:'Trusted community',d:'Build your profile and grow through reviews and repeat customers.'}
  ];name='';email='';phone='';reason='';city='Delhi';submitted=false;constructor(private router:Router,public app:AppService){this.app.user$.subscribe(u=>{this.loggedIn=!!localStorage.getItem('companion-token');this.currentName=u?.fullName||'';this.currentRole=String(u?.role||localStorage.getItem('companion-role')||'').toLowerCase();});}apply(){if(!this.name||!this.email){this.submitted=true;return}this.router.navigate(['/signup'],{queryParams:{name:this.name,email:this.email,role:'companion'}})}}
