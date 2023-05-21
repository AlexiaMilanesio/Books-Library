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
  bookId!: string;
  libraries!: Array<Library>;
  libraryId!: number;
  errorMessage: string | undefined;
  length!: number;
  pageNumber: number = 1; 
  pageIndex: number = 0;
  pageSize: number = 10;
  pageSizeOptions: Array<number> = [10, 25, 50, 100];
  pageEvent: PageEvent | undefined;


  constructor(private booksService: BookService, private router: Router) {
    this.libraryId = this.booksService.currentLibraryId;
    this.booksService.getLibraries().subscribe(libraries => {
      this.libraries = libraries.data;
    })
  }

  ngOnInit(): void {}

  ngAfterViewInit() {
    this.getServerData();
  }


  public getServerData(event?: PageEvent) {
    if (event) {
      this.pageNumber = event.pageIndex + 1;
      this.pageSize = event.pageSize;
      console.log(
        "library id: " + this.libraryId + 
        ", page number: " + this.pageNumber + 
        ", page size: " + this.pageSize
      );
      this.getLibraryBooks(this.libraryId, this.pageNumber , this.pageSize);
    } else {
      console.log(
        "library id: " + this.libraryId + 
        ", page number: " +  this.pageNumber + 
        ", page size: " + this.pageSize
      );
      this.getLibraryBooks(this.libraryId, this.pageNumber, this.pageSize);
    }
    return event;
  }


  public getLibraryBooks(libraryId: number, pageNumber: number, pageSize: number): void {
    this.booksService.getBooksByLibrary(libraryId, pageNumber, pageSize).subscribe((response) => {
      try {
        if (response.data.length === 0 || response === undefined) {
          throw ({ message: "No books where found in this library" });
        }
        else {
          console.log(response);
          this.books = new MatTableDataSource(response.data);
          this.books.paginator = this.paginator;
          this.displayedColumns = Object.keys(response.data[0]);
          this.length = response.totalRecords;
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
    this.getLibraryBooks(this.libraryId, 1, this.pageSize);
  }


  public goToLibraries(): void {
    this.router.navigate(['Libraries']);
  }


  public goToEditMode(bookToEdit: Book): void {
    this.booksService.setCurrentBook(bookToEdit);
    this.router.navigate(["EditBook"]);
  }
}
