import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { User } from 'src/app/models/models';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss'],
})
export class NavbarComponent implements OnInit {
  currentUser!: User;
  isLoggedIn!: boolean;

  constructor(private userService: UserService, private router: Router) {
    this.userService.getCurrentUserObservable().subscribe((user) => {
      this.currentUser = user;
    });

    this.userService.getIsLoggedInObservable().subscribe((session) => {
      this.isLoggedIn = session;
    });
  }

  ngOnInit(): void {}



  public goToProfile(): void {
    this.router.navigate([`Profile/${this.currentUser.id}}`]);
  }


  public logout(): void {    
    this.userService.users.find(user => {
      if (user.email === this.currentUser.email) {
        user.isLoggedIn = false;
      }
    });
    this.userService.saveData('users', this.userService.users);

    this.currentUser = {
      id: '',
      isSuperAdmin: false,
      isLoggedIn: false,
      name: '',
      lastname: '',
      email: '',
      password: '',
    };

    this.userService.setCurrentUser(this.currentUser);
    this.userService.saveData('currentUser', this.currentUser);
    this.isLoggedIn = false;
    this.router.navigate(['']);
  }
}
