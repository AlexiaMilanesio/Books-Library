import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { User } from 'src/app/models/models';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {
  currentUser!: User;
  loginError: boolean = false;
  message!: string;

  constructor(private userService: UserService, private router: Router) {
    if (this.userService.getUsers('users').length === 0) { // todo revisar
      this.userService.clearData();
    }
    this.userService.getUsers('users');
    console.log('USERS FROM USER SERVICE - Login Component');
    console.log(this.userService.users);
  }

  ngOnInit(): void {}


  public login(formValue: User): void {
    this.loginError = false;
    this.message = '';

    let foundUser = this.userService.users.find((user) => user.email === formValue.email);

    if (!foundUser) {
      this.message = 'You are not a register user, try again or ask a member of the staff to register you';
      this.loginError = true;
    } 
    else {
      if (foundUser.password !== formValue.password) {
        this.message = 'Incorrect password, try again';
        this.loginError = true;
        return;
      }

      this.currentUser = {
        ...foundUser, 
        isLoggedIn: true 
      };

      this.userService.setCurrentUser(this.currentUser);
      this.userService.users.find(user => {
        if (user.email === this.currentUser.email) {
          user.isLoggedIn = true;
        }
      });
      this.userService.saveData('currentUser', this.currentUser);
      this.userService.saveData('users', this.userService.users);

      this.router.navigate([`/Profile/${this.currentUser.id}`]);
    }
  }
}
