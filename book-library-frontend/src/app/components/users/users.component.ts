import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { User } from 'src/app/models/models';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss']
})
export class UsersComponent implements OnInit {
  currentUser!: User;
  users!: User[];
  filteredUsers: User[] = [];
  errorMessage: string | undefined;


  constructor(private userService: UserService, private router: Router) {
    this.currentUser = this.userService.getCurrentUser('currentUser');
    this.users = this.userService.getUsers('users');
  }

  ngOnInit(): void {}


  public searchUser(searchedText: string): void {
    this.errorMessage = undefined;
    this.users = this.userService.getUsers('users');
    this.filteredUsers = [];

    let text = searchedText.toString().toLowerCase();
    if (text === "" || text === " ") return;

    this.users.forEach(user => {
      if (
        user.id.toLowerCase().includes(text) ||
        user.email.toLowerCase().includes(text) ||
        user.name.toLowerCase().includes(text) ||
        user.lastname.toLowerCase().includes(text)
      ) {
        this.filteredUsers.push(user);
      }
    });

    this.filteredUsers.length === 0 
      ? this.errorMessage = "No user found" 
      : this.users = this.filteredUsers;
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


  public goToRegister(): void {
    this.router.navigate(['/Register']);
  }
}
