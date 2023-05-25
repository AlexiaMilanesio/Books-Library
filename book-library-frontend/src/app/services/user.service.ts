import { Injectable } from '@angular/core';
import { User } from '../models/models';
import { Observable, of } from 'rxjs';
import * as uuid from 'uuid';
import * as CryptoJS from 'crypto-js';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  users: User[] = [];

  superAdmin = {
    id: uuid.v4().toString(),
    isSuperAdmin: true,
    isLoggedIn: false,
    name: 'Alexía',
    lastname: 'Milanesio',
    email: 'alexiamilanesio9@gmail.com',
    password: 'alexia123'
  }

  currentUser: User = {
    id: '',
    isSuperAdmin: false,
    isLoggedIn: false,
    name: '',
    lastname: '',
    email: '',
    password: ''
  };

  constructor() {}


  // Local Storage

  // public saveData(key: string, value: string) {
  //   localStorage.setItem(key, this.encrypt(value));
  // }

  // public getData(key: string) {
  //   let data = localStorage.getItem(key) || [];
  //   return this.decrypt(data);
  // }

  public saveData(key: string, value: User[] | User | string) {
    localStorage.setItem(key, JSON.stringify(value));
  }


  public getUsers(key: string): User[] {
    let data = localStorage.getItem(key);

    if (data) {
      this.users = JSON.parse(data);
    }
    else {
      this.users.push(this.superAdmin);
      this.saveData('users', this.users);
      let usersData = localStorage.getItem(key);
      this.users = usersData && JSON.parse(usersData);
    }
    return this.users;
  }
  

  public getCurrentUser(key: string): User {
    let data = localStorage.getItem(key);

    if (data) {
      this.currentUser = JSON.parse(data);
    }
    return this.currentUser;
  }


  public removeData(key: string) {
    localStorage.removeItem(key);
  }

  public clearData() {
    localStorage.clear();
  }

  // private encrypt(txt: string): string {
  //   return CryptoJS.AES.encrypt(txt, this.key).toString();
  // }

  // private decrypt(txtToDecrypt: string) {
  //   return CryptoJS.AES.decrypt(txtToDecrypt, this.key).toString(CryptoJS.enc.Utf8);
  // }


  // Getters

  public getCurrentUserObservable(): Observable<User> {
    return of(this.getCurrentUser('currentUser'));
  }

  public getIsLoggedInObservable(): Observable<boolean> {
    return of(this.getCurrentUser('currentUser').isLoggedIn);
  }

  
  // Setters

  setCurrentUser(currentUser: User) {
    this.currentUser = {
      id: currentUser.id,
      isSuperAdmin: currentUser.isSuperAdmin,
      isLoggedIn: currentUser.isLoggedIn,
      name: currentUser.name,
      lastname: currentUser.lastname,
      email: currentUser.email,
      password: currentUser.password,
    };
  }

  setUsers(user: User) {
    this.users.push(user);
  }
}
