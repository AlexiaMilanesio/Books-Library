import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { User } from 'src/app/models/models';
import { UserService } from 'src/app/services/user.service';
import * as uuid from 'uuid';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss'],
})
export class RegisterComponent implements OnInit {
  currentUser!: User;
  successMessage: string | undefined;
  errorMessage: string | undefined;
  emailRegex = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;


  constructor(private userService: UserService, private router: Router) {
    console.log(this.userService.getUsers('users'));
  }

  ngOnInit(): void {}


  public register(formValue: User): void {
    this.successMessage = undefined;
    this.errorMessage = undefined;

    if (!this.emailRegex.test(formValue.email)) {
      this.errorMessage = "Email is not valid";
      return;
    }

    let foundUser = this.userService.users.find((user) => user.email === formValue.email);

    if (foundUser) {
      this.errorMessage = 'User already registered, try again or go to login';
    } else {
      let id = uuid.v4().toString();

      this.currentUser = {
        id: id,
        isSuperAdmin: false,
        isLoggedIn: false,
        name: formValue.name,
        lastname: formValue.lastname,
        email: formValue.email,
        password: formValue.password,
      };
      
      this.userService.setCurrentUser(this.currentUser);
      this.userService.setUsers(this.currentUser);
      this.userService.saveData('users', this.userService.users);
      this.successMessage = 'User successfully registered';
    }
  }


  public goToLogin(): void {
    this.router.navigate(['Login']);
  }


  public goToProfile(): void {
    this.router.navigate([`Profile/${this.currentUser.id}`]);
  }
}
