import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {
  isLoggedIn: boolean;

  constructor(private userService: UserService, private router: Router) {
    this.isLoggedIn = this.userService.getCurrentUser('currentUser').isLoggedIn;
  }

  ngOnInit(): void {}


  goToLogin(): void {
    this.router.navigate(['Login']);
  }
}
