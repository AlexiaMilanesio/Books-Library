import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Book } from 'src/app/models/models';
import { BookService } from 'src/app/services/book.service';

@Component({
  selector: 'app-edit-book',
  templateUrl: './edit-book.component.html',
  styleUrls: ['./edit-book.component.scss'],
})
export class EditBookComponent implements OnInit {
  currentBook!: Book;
  message: string = "";

  constructor(private booksService: BookService, private router: Router) {
    this.currentBook = this.booksService.currentBook;
  }

  ngOnInit(): void {}

  public editBook(title: string, year: string, publisher: string, image_url: string, libraryId: string, author: string): void {
    const editedBook: Book = {
      isbn: this.currentBook.isbn,
      title: title,
      year: Number(year),
      publisher: publisher,
      image_url: image_url,
      libraryId: Number(libraryId),
      author: author,
    };

    this.booksService.editBook(editedBook).subscribe(book => {
      try {
        if (!book) throw ({ message: "Book couldn't be edited" });

        else {
          console.log("Edited book:");
          console.log(book);
          this.message = "Book successfully edited";
        }
      }
      catch (e: any) {
        this.message = e.message;
      }
    });
  }

  
  public deleteBook(): void {
    this.booksService.deleteBook(this.currentBook.isbn).subscribe(book => {
      try {
        if (!book) throw ({ message: "Book couldn't be deleted" });
        else {
          console.log("Deleted book:");
          console.log(book);
          this.message = "Book successfully deleted";
        }
      }
      catch(e: any) {
        this.message = e.message;
      }
    });
  }


  public goToLibraries(): void {
    this.router.navigate(['Libraries']);
  }
}
