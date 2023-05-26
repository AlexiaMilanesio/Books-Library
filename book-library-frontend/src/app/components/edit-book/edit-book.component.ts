import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Router } from '@angular/router';
import { Book, Library } from 'src/app/models/models';
import { BookService } from 'src/app/services/book.service';

@Component({
  selector: 'app-edit-book',
  templateUrl: './edit-book.component.html',
  styleUrls: ['./edit-book.component.scss'],
})
export class EditBookComponent implements OnInit {
  libraries!: Library[];
  currentBook!: Book;
  successMessage: string | undefined;
  errorMessage: string | undefined;
  selectedLibraryId;


  constructor(private booksService: BookService, private router: Router) {
    this.booksService.getLibraries().subscribe((libraries) => {
      this.libraries = libraries.data;
    });

    this.currentBook = this.booksService.currentBook;
    this.selectedLibraryId = new FormControl(this.currentBook.libraryId);
  }

  ngOnInit(): void {}


  public compareWith(object1: any, object2: any): boolean {
    return object1 && object2 && object1.label === object2.label;
  }
  

  public editBook(formValue: Book): void {
    const editedBook: Book = {
      isbn: this.currentBook.isbn,
      title: formValue.title,
      year: Number(formValue.year),
      publisher: formValue.publisher,
      image_url: formValue.image_url,
      libraryId: this.selectedLibraryId.value,
      author: formValue.author,
    };

    this.booksService.editBook(editedBook).subscribe((book) => {
      try {
        if (!book) throw { message: "Book couldn't be edited" };
        else {
          console.log('Edited book:');
          console.log(book);
          this.errorMessage = undefined;
          this.successMessage = 'Book successfully edited';
        }
      } catch (e: any) {
        this.errorMessage = e.message;
      }
    });
  }


  public deleteBook(): void {
    this.booksService.deleteBook(this.currentBook.isbn).subscribe((book) => {
      try {
        if (!book) throw { message: "Book couldn't be deleted" };
        else {
          console.log('Deleted book:');
          console.log(book);
          this.errorMessage = undefined;
          this.successMessage = 'Book successfully deleted';
        }
      } catch (e: any) {
        this.errorMessage = e.message;
      }
    });
  }


  public goToBooks(): void {
    this.router.navigate(['Books']);
  }
}
