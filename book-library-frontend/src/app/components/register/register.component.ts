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
  showLogin: boolean = false;
  registerError: boolean = false;
  message!: string;

  constructor(private userService: UserService, private router: Router) {
    console.log(this.userService.getUsers('users'));
  }

  ngOnInit(): void {}

  public register(formValue: User): void {
    this.showLogin = false;
    this.registerError = false;
    this.message = '';

    let foundUser = this.userService.users.find((user) => user.email === formValue.email);

    if (foundUser) {
      this.message = 'User already registered, try again or go to login';
      this.showLogin = true;
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
      this.router.navigate([`/Profile/${this.currentUser.id}`]);

      console.log(this.userService.getUsers('users'));
    }
  }

  public goToLogin(): void {
    this.router.navigate(['/Login']);
  }
}
