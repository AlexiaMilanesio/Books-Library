import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { User } from 'src/app/models/models';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-edit-user',
  templateUrl: './edit-user.component.html',
  styleUrls: ['./edit-user.component.scss']
})
export class EditUserComponent implements OnInit {
  currentUser!: User;
  id!: string;
  userToEdit!: User;
  editionError!: string;
  message!: string;

  constructor(private userService: UserService, private router: Router, private route: ActivatedRoute) {
    this.currentUser = this.userService.getCurrentUser('currentUser');
  }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.id = params['id'];
    })

    let foundUserToEdit = this.userService.getUsers('users').find(user => user.id === this.id);

    if (foundUserToEdit) {
      this.userToEdit = foundUserToEdit;
    }
  }

  public editUser(formValue: User): void {
    let editedUser: User = {
      id: this.userToEdit.id,
      isSuperAdmin: this.userToEdit.isSuperAdmin,
      isLoggedIn: this.userToEdit.isLoggedIn,
      name: formValue.name,
      lastname: formValue.lastname,
      email: formValue.email,
      password: formValue.password
    };

    this.userToEdit = editedUser;
    
    if (this.id === this.currentUser.id) {
      this.currentUser = editedUser;
      this.userService.setCurrentUser(this.currentUser);
      this.userService.saveData('currentUser', this.userService.currentUser);
    }
    
    let updatedUsers: User[] = [];
    this.userService.getUsers('users').forEach(user => {
      if (user.id === this.userToEdit.id) {
        user = editedUser;
      }
      updatedUsers.push(user);
    });

    this.userService.saveData('users', updatedUsers);

    this.router.navigate([`Profile/${this.currentUser.id}`]);
  }
}
