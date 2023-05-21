import { Component, ViewChild, OnInit } from '@angular/core';
import { Book, Library } from 'src/app/models/models';
import { BookService } from 'src/app/services/book.service';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';

@Component({
  selector: 'app-books',
  templateUrl: './books.component.html',
  styleUrls: ['./books.component.scss']
})
export class BooksComponent implements OnInit {
  @ViewChild('paginator') paginator!: MatPaginator;
  displayedColumns!: string[];
  books!: MatTableDataSource<Book>;
  libraries!: Array<Library>;
  length!: number;
  pageEvent: PageEvent | undefined;
  bookId!: string;
  currentLibraryId!: number;
  errorMessage: string | undefined;


  constructor(private booksService: BookService, private router: Router) {
    this.currentLibraryId = this.booksService.currentLibraryId;
    this.booksService.getLibraries().subscribe(libraries => {
      this.libraries = libraries.data;
    })
  }

  ngOnInit(): void {}

  ngAfterViewInit() {
    this.getServerData();
  }


  public getServerData(event?: PageEvent) {
    this.getLibraryBooks();
    return event;
  }


  public getLibraryBooks(): void {
    this.booksService.getBooksByLibrary(this.currentLibraryId).subscribe((books) => {
      try {
        if (books.data.length === 0 || books === undefined) {
          throw ({ message: "No books where found in this library" });
        }
        else {
          this.books = new MatTableDataSource(books.data);
          this.books.paginator = this.paginator;
          this.displayedColumns = Object.keys(books.data[0]);
          this.length = books.data.length;
        }
      }
      catch (e: any) {
        this.errorMessage = e.message;
        setTimeout(() => {
          this.errorMessage = "";
          this.router.navigate(['Libraries']);
        }, 4000);
      }
    })
  }

  
  public getBookId(id: string): void {
    if (id === "" || id === " ") return;
    this.bookId = id;
    this.searchBookById();
  }


  public searchBookById(): void {
    this.booksService.getBookById(this.bookId).subscribe(book => {
      try {
        if (book.data.length === 0) throw ({ message: "No book was found, try with a different id"});

        this.books = new MatTableDataSource(book.data);
        this.books.paginator = this.paginator;
        this.length = this.books.data.length;
      }
      catch (e: any) {
        this.errorMessage = e.message;
        setTimeout(() => {
          this.errorMessage = "";
        }, 4000);
      }
    })
  }


  public resetLibraryBooks(): void {
    this.getLibraryBooks();
  }


  public goToLibraries(): void {
    this.router.navigate(['Libraries']);
  }


  public goToEditMode(bookToEdit: Book): void {
    this.booksService.setCurrentBook(bookToEdit);
    this.router.navigate(["EditBook"]);
  }
}
