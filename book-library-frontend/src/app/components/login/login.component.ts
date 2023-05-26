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
  errorMessage: string | undefined;

  constructor(private userService: UserService, private router: Router) {
    if (this.userService.getUsers('users').length === 0) {
      this.userService.clearData();
    }
    this.userService.getUsers('users');
  }

  ngOnInit(): void {}


  public login(formValue: User): void {
    this.errorMessage = undefined;

    let foundUser = this.userService.users.find((user) => user.email === formValue.email);

    if (!foundUser) {
      this.errorMessage = 'You are not a register user, try again or ask a member of the staff to register you';
    } 
    else {
      if (foundUser.password !== formValue.password) {
        this.errorMessage = 'Incorrect password, try again';
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

      this.router.navigate(['']);
    }
  }
}
