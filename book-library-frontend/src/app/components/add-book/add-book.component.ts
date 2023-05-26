import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Router } from '@angular/router';
import { Book, Library } from 'src/app/models/models';
import { BookService } from 'src/app/services/book.service';
import * as uuid from 'uuid';

@Component({
  selector: 'app-add-book',
  templateUrl: './add-book.component.html',
  styleUrls: ['./add-book.component.scss'],
})
export class AddBookComponent implements OnInit {
  libraries!: Library[];
  book: Book | undefined;
  selectedLibraryId = new FormControl();
  imageUrlRegex = /(https?:\/\/.*\.(?:png|jpg))/i;
  formErrorMessage: string | undefined;
  errorMessage: string | undefined;
  successMessage: string | undefined;


  constructor(private booksService: BookService, private router: Router) {
    this.booksService.getLibraries().subscribe(libraries => {
      this.libraries = libraries.data;
    });
  }

  ngOnInit(): void {}
  

  public addBook(formValue: Book): void {
    console.log(formValue)
    this.formErrorMessage = undefined;

    if (!Number(formValue.year)) {
      this.formErrorMessage = "Year is invalid";
      return;
    }
    if (!this.imageUrlRegex.test(formValue.image_url)) {
      this.formErrorMessage = "Image url is invalid";
      return;
    }
  
    let formattedTitle = formValue.title.charAt(0).toUpperCase() + formValue.title.slice(1);
    let formattedPublisher = formValue.publisher.charAt(0).toUpperCase() + formValue.publisher.slice(1);
    let formattedAuthor = formValue.author.charAt(0).toUpperCase() + formValue.author.slice(1);
    let formattedBookIsbn = uuid.v4().toString();

    let book = {
      isbn: formattedBookIsbn,
      title: formattedTitle,
      year: Number(formValue.year),
      publisher: formattedPublisher,
      image_url: formValue.image_url,
      libraryId: this.selectedLibraryId.value,
      author: formattedAuthor,
    };

    this.book = book;

    this.booksService.addBook(book).subscribe(book => {
      try {
        if (!book) throw ({ message: "Couldn't add book" });
        else {
          console.log("Added book:");
          console.log(book);
          this.formErrorMessage = undefined;
          this.errorMessage = undefined;
          this.successMessage = "Book successfully added";
        }
      }
      catch(e: any) {
        this.errorMessage = e.message;
      }
    })
  }


  public getLibraryName(id: number): string {
    let libraryName = this.libraries.find(library => library.id === id)?.name;
    return libraryName ? libraryName : "";
  }


  public goToLibraries(): void {
    this.router.navigate(['Libraries']);
  }
}
