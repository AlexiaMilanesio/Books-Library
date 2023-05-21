import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Book } from 'src/app/models/models';
import { BookService } from 'src/app/services/book.service';
import * as uuid from 'uuid';

@Component({
  selector: 'app-add-book',
  templateUrl: './add-book.component.html',
  styleUrls: ['./add-book.component.scss'],
})
export class AddBookComponent implements OnInit {
  book: Book | undefined;
  message: string | undefined;

  constructor(private booksService: BookService, private router: Router) {}

  ngOnInit(): void {}


  public addBook(
    title: HTMLInputElement,
    year: HTMLInputElement,
    publisher: HTMLInputElement,
    image_url: HTMLInputElement,
    libraryId: HTMLInputElement,
    authorId: HTMLInputElement
  ): void {
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
    
    this.booksService.addBook(book).subscribe(book => {
      try {
        if (!book) throw ({ message: "Couldn't add book" });
        else {
          console.log("Added book:");
          console.log(book);
          this.message = "Book added successfully";
        }
      }
      catch(e: any) {
        this.message = e.message;
      }
    })
  }


  public goToBooks(): void {
    this.router.navigate(['Books']);
  }
}
