import { Component, OnInit } from '@angular/core';
import { Book } from 'src/app/models/models';
import { BookService } from 'src/app/services/book.service';
import * as uuid from 'uuid';

@Component({
  selector: 'app-add-book',
  templateUrl: './add-book.component.html',
  styleUrls: ['./add-book.component.scss'],
})
export class AddBookComponent implements OnInit {
  books!: Array<Book>;
  book: Book | undefined;

  constructor(private booksService: BookService) {
    this.booksService.getBooks().subscribe((books) => {
      this.books = books.data;
    });
  }

  ngOnInit(): void {}

  public addBook(
    title: HTMLInputElement,
    year: HTMLInputElement,
    publisher: HTMLInputElement,
    image_url: HTMLInputElement,
    libraryId: HTMLInputElement,
    authorId: HTMLInputElement
  ) {
    let book = {
      isbn: uuid.v4().toString(),
      title: title.value.toString(),
      year: Number(year.value),
      publisher: publisher.value.toString(),
      image_url: image_url.value.toString(),
      libraryId: Number(libraryId.value),
      authorId: Number(authorId.value),
    };

    this.book = book;
    
    try {
      this.booksService.addBook(book);
    }
    catch (e: any) {
      console.log(e)
    }

    this.booksService.getBookById(this.book.isbn).subscribe(book => {
      try {
        if (!book) throw ({ message: "Book not found" });
        console.log(book);
      }
      catch (e: any) {
        console.log(e.message);
      }
    })
  }
}
