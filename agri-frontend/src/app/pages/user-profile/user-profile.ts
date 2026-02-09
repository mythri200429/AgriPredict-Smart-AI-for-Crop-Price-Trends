import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CardModule } from 'primeng/card';

@Component({
  selector: 'app-user-profile',
  imports: [CommonModule, CardModule],
  templateUrl: './user-profile.html',
  styleUrl: './user-profile.scss'
})
export class UserProfile implements OnInit {
  user:any = { };

  constructor(private router: Router) { }

  ngOnInit(): void {
    let data: any = localStorage.getItem('userdetails')
    this.user = JSON.parse(data) || {}
  }

  signOut() {
    localStorage.removeItem("token");
    localStorage.removeItem('userdetails')
    this.router.navigate(['/login']);
  }
}
