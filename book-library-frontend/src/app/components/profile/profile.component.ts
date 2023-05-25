import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { User } from 'src/app/models/models';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {
  currentUser!: User;
  users!: User[];

  constructor(private userService: UserService, private router: Router) {
    this.currentUser = this.userService.getCurrentUser('currentUser');
    this.users = this.userService.getUsers('users');
  }

  ngOnInit(): void {
    if (!localStorage.getItem('reload')) { 
      this.userService.saveData('reload', 'no reload');
      location.reload();
    } 
    else this.userService.removeData('reload');
  }

  
  public goToEdit(id: string): void {
    this.router.navigate([`/EditUser/${id}`]);
  }


  public deleteAccount(id: string): void {
    let foundUser = this.userService.getUsers('users').find(user => user.id === id);

    if (foundUser) {
      if (confirm(`Are you sure you want to delete user ${foundUser.email}?`)) {
        this.deleteFromUsers(id);
        this.userService.saveData('users', this.userService.users);

        if (this.currentUser.id !== id) {
          this.users = this.userService.getUsers('users');
        } 
        else {
          this.logout(id);
        }
      }
    }
  }


  private deleteFromUsers(id: string): void {
    this.userService.users.filter((user, i) => {
      if (user.id === id) {
        this.userService.users.splice(i, 1);
      }
    });

    this.userService.saveData('users', this.userService.users);
  }


  private logout(id: string): void {
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
    this.router.navigate(['']); 
  }
  

  public goToRegister(): void {
    this.router.navigate(['/Register']);
  }
}
