import { Component, OnInit } from '@angular/core';
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

  constructor(private booksService: BookService) {
    this.currentBook = this.booksService.currentBook;
  }

  ngOnInit(): void {}

  public editBook(
    title: HTMLInputElement,
    year: HTMLInputElement,
    publisher: HTMLInputElement,
    image_url: HTMLInputElement,
    libraryId: HTMLInputElement,
    authorId: HTMLInputElement
  ): void {
    const editedBook: Book = {
      isbn: this.currentBook.isbn,
      title: title.value.toString(),
      year: Number(year.value),
      publisher: publisher.value.toString(),
      image_url: image_url.value.toString(),
      libraryId: Number(libraryId.value),
      authorId: Number(authorId.value),
    };

    this.booksService.editBook(editedBook).subscribe(book => {
      try {
        if (!book) throw ({ message: "Book couldn't be edited" });

        else {
          console.log("Edited book:");
          console.log(book);
          throw ({ message: "Book successfully edited" });
        }
      }
      catch (e: any) {
        this.message = e.message;
      }
    });
  }

  
  public deleteBook(): void {
    console.log(this.currentBook.isbn)
    this.booksService.deleteBook(this.currentBook.isbn).subscribe(book => {
      try {
        if (!book) throw ({ message: "Book couldn't be deleted" });
        else {
          console.log("Deleted book:");
          console.log(book);
          throw ({ message: "Book successfully deleted" });
        }
      }
      catch(e: any) {
        this.message = e.message;
      }
    });
  }
}
