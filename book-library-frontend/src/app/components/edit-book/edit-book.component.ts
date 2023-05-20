import { Component, OnInit, Input } from '@angular/core';
import { Book } from 'src/app/models/models';
import { BookService } from 'src/app/services/book.service';

@Component({
  selector: 'app-edit-book',
  templateUrl: './edit-book.component.html',
  styleUrls: ['./edit-book.component.scss'],
})
export class EditBookComponent implements OnInit {
  currentBook!: Book;

  constructor(private booksService: BookService) {
    this.currentBook = this.booksService.currentBook;
    console.log(this.currentBook);
  }

  ngOnInit(): void {}

  public editBook(
    title: HTMLInputElement,
    year: HTMLInputElement,
    publisher: HTMLInputElement,
    image_url: HTMLInputElement,
    libraryId: HTMLInputElement,
    authorId: HTMLInputElement
  ) {
    let editedBook = {
      ...this.currentBook,
      title: title.value.toString(),
      year: Number(year),
      publisher: publisher.value.toString(),
      image_url: image_url.value.toString(),
      libraryId: Number(libraryId.value),
      authorId: Number(authorId.value),
    };

    console.log(editedBook);
    this.booksService.addBook(editedBook);
    this.booksService.books.forEach((book) => {
      if (book.isbn === this.currentBook.isbn) {
        book = editedBook;
      }
    });
  }
}
