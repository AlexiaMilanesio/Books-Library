import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BooksComponent } from './components/books/books.component';
import { AddBookComponent } from './components/add-book/add-book.component';
import { EditBookComponent } from './components/edit-book/edit-book.component';
import { LibrariesComponent } from './components/libraries/libraries.component';

const routes: Routes = [
  { path: "", component: LibrariesComponent },
  { path: "Libraries", component: LibrariesComponent },
  { path: "Books", component: BooksComponent },
  { path: "AddBook", component: AddBookComponent },
  { path: "EditBook", component: EditBookComponent },
  { path: "**", component: LibrariesComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
