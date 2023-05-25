import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { LoginComponent } from './components/login/login.component';
import { ProfileComponent } from './components/profile/profile.component';
import { RegisterComponent } from './components/register/register.component';
import { EditUserComponent } from './components/edit-user/edit-user.component';
import { LibrariesComponent } from './components/libraries/libraries.component';
import { BooksComponent } from './components/books/books.component';
import { EditBookComponent } from './components/edit-book/edit-book.component';
import { AddBookComponent } from './components/add-book/add-book.component';
import { NotFoundComponent } from './components/not-found/not-found.component';

const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'Login', component: LoginComponent },
  { path: 'Profile/:id', component: ProfileComponent },
  { path: 'Register', component: RegisterComponent },
  { path: 'EditUser/:id', component: EditUserComponent },
  { path: 'Libraries', component: LibrariesComponent },
  { path: 'Books', component: BooksComponent },
  { path: 'AddBook', component: AddBookComponent },
  { path: 'EditBook', component: EditBookComponent },
  { path: '**', component: NotFoundComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
