import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { HttpClientModule } from '@angular/common/http';

import { BookService } from './services/book.service';
import { UserService } from './services/user.service';

import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatTableModule } from '@angular/material/table';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatCardModule } from '@angular/material/card';
import { MatSortModule } from '@angular/material/sort';
import { MatMenuModule } from '@angular/material/menu';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatToolbarModule } from '@angular/material/toolbar';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { AppComponent } from './app.component';
import { HomeComponent } from './components/home/home.component';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { ProfileComponent } from './components/profile/profile.component';
import { LibrariesComponent } from './components/libraries/libraries.component';
import { BooksComponent } from './components/books/books.component';
import { AddBookComponent } from './components/add-book/add-book.component';
import { EditBookComponent } from './components/edit-book/edit-book.component';
import { NotFoundComponent } from './components/not-found/not-found.component';
import { EditUserComponent } from './components/edit-user/edit-user.component';
import { NavbarComponent } from './components/navbar/navbar.component';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    LoginComponent,
    RegisterComponent,
    ProfileComponent,
    LibrariesComponent,
    BooksComponent,
    AddBookComponent,
    EditBookComponent,
    NotFoundComponent,
    EditUserComponent,
    NavbarComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    NoopAnimationsModule,
    MatPaginatorModule,
    MatTableModule,
    MatInputModule,
    MatSelectModule,
    MatCardModule,
    MatSortModule,
    MatMenuModule,
    MatButtonModule,
    MatIconModule,
    MatToolbarModule,
    FormsModule,
    ReactiveFormsModule,
  ],
  providers: [BookService, UserService],
  bootstrap: [AppComponent]
})
export class AppModule { }
