import { Component, ViewChild, OnInit } from '@angular/core';
import { Book } from 'src/app/models/models';
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
  length!: number;
  pageEvent: PageEvent | undefined;
  selectedLibraryId!: number;
  bookId!: string;
  errorMessage: string | undefined;

  constructor(private booksService: BookService, private router: Router) {}

  ngOnInit(): void {}

  ngAfterViewInit() {
    this.getServerData();
  }

  public getServerData(event?: PageEvent) {
    this.getBooks();
    return event;
  }

  public getBooks(): void {
    this.booksService.getBooks().subscribe(books => {
      try {
        if (books.data.length === 0 || books === undefined) throw ({ message: "Couldn't get books" });
        
        this.books = new MatTableDataSource(books.data);
        this.books.paginator = this.paginator;
        this.length = books.data.length;
        this.displayedColumns = Object.keys(books.data[0]);
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
        if (!book.data) throw ({ message: "No book was found, try with a different id"});

        this.books = new MatTableDataSource(book.data);
        this.books.paginator = this.paginator;
        this.length = this.books.data.length;
      }
      catch (e: any) {
        this.errorMessage = e.message;
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
