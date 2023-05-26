import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { User } from 'src/app/models/models';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {
  isLoggedIn!: boolean;
  currentUser!: User;

  
  constructor(private userService: UserService, private router: Router) {
    this.isLoggedIn = this.userService.getCurrentUser('currentUser').isLoggedIn;
    this.currentUser = this.userService.currentUser;
  }

  ngOnInit(): void {}


  public goToLogin(): void {
    this.router.navigate(['Login']);
  }
  

  public goToLibraries(): void {
    this.router.navigate(['Libraries']);
  }


  public goToProfile(): void {
    this.router.navigate([`Profile/${this.currentUser.id}`]);
  }
}
