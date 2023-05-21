import { Component, OnInit, ViewChild } from '@angular/core';
import { BookService } from 'src/app/services/book.service';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { Library, Book } from 'src/app/models/models';
import { Router } from '@angular/router';

@Component({
  selector: 'app-libraries',
  templateUrl: './libraries.component.html',
  styleUrls: ['./libraries.component.scss'],
})
export class LibrariesComponent implements OnInit {
  @ViewChild('paginator') paginator!: MatPaginator;
  displayedColumns!: Array<string>;
  libraries!: Array<Library>;
  books!: Array<Book>;
  dataSource!: MatTableDataSource<any>;
  length!: number;
  pageEvent!: PageEvent;
  libraryId!: number; 
  bookId!: string;
  errorMessage!: string;

  constructor(private booksService: BookService, private router: Router) {}

  ngOnInit(): void {}

  ngAfterViewInit() {
    this.getLibraries();
  }

  // Libraries

  public getLibraries(): void {
    this.booksService.getLibraries().subscribe((libraries) => {
      try {
        if (libraries.data.length === 0 || libraries === undefined) {
          throw ({ message: "There's been an error: no libraries where found" });
        }
        this.libraries = libraries.data;
      }
      catch (e: any) {
        this.errorMessage = e.message;
      }
    });
  }

  public getServerData(event?: PageEvent): PageEvent | undefined {
    if (!this.books) {
      this.searchLibraryBooks();
      this.dataSource = new MatTableDataSource(this.libraries);
    }
    else {
      this.getBooks();
      this.dataSource = new MatTableDataSource(this.books);
    }

    this.dataSource.paginator = this.paginator;
    this.displayedColumns = Object.keys(this.books[0]);
    this.length = this.dataSource.data.length;

    return event;
  }    

  public getLibraryId(id: string): void {
    if (id === "" || id === " ") return;
    this.libraryId = Number(id);
    this.searchLibraryBooks();
  }

  public searchLibraryBooks(): void {
    this.booksService.getBooksByLibrary(this.libraryId).subscribe((books) => {
      try {
        let idExists = this.libraries.find((library: Library) => library.id === this.libraryId);
          
        if (idExists === undefined) throw ({ message: "Id doesn't exists, try a different one" });
        else if (books.data.length === 0 || books === undefined) throw ({ message: "No books where found in this library" });
        else this.books = books.data;
      }
      catch (e: any) {
        this.errorMessage = e.message;
        setTimeout(() => {
          this.errorMessage = "";
        }, 4000);
      }
    })
  }

  public resetSearch(): void {
    this.books = [];
    this.getLibraries();
  }


  // Books

  public getBooks(): void {
    this.booksService.getBooks().subscribe(books => {
      try {
        if (books.data.length === 0 || books === undefined) throw ({ message: "Couldn't get books" });
        else this.books = books.data;
      }
      catch (e: any) {
        this.errorMessage = e.message;
      }
    });
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

  public resetBooks(): void {
    this.getBooks();
  }

  public goToEditMode(bookToEdit: Book): void {
    this.booksService.setCurrentBook(bookToEdit);
    this.router.navigate(["EditBook"]);
  }
}
