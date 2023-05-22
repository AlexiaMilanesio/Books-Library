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
    title: string,
    year: string,
    publisher: string,
    image_url: string,
    libraryId: string,
    authorId: string
  ): void {

    let formattedTitle = title.charAt(0).toUpperCase() + title.slice(1);
    let formattedPublisher = publisher.charAt(0).toUpperCase() + publisher.slice(1);
    let formattedBookIsbn = uuid.v4().toString();

    let book = {
      isbn: formattedBookIsbn,
      title: formattedTitle,
      year: Number(year),
      publisher: formattedPublisher,
      image_url: image_url,
      libraryId: Number(libraryId),
      authorId: Number(authorId),
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


  public goToLibraries(): void {
    this.router.navigate(['Libraries']);
  }
}
