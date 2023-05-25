import { Component, ViewChild, OnInit } from '@angular/core';
import { Book, Filter, Library } from 'src/app/models/models';
import { BookService } from 'src/app/services/book.service';
// import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'app-books',
  templateUrl: './books.component.html',
  styleUrls: ['./books.component.scss']
})
export class BooksComponent implements OnInit {
  libraryId: number | undefined;
  bookId: string | undefined;
  bookTitle: string | undefined;
  bookAuthor: string | undefined;
  selectedOrder = new FormControl('');
  displayedColumns!: string[];
  books!: MatTableDataSource<Book>;
  errorMessage: string | undefined;
  length!: number;
  pageNumber: number = 1; 
  lastPageNumber!: number;
  pageSize: number = 10;
  totalPages!: number;
  totalRecords!: number;
  selectedPagination= new FormControl('10');


  constructor(private booksService: BookService, private router: Router) {
    this.libraryId = this.booksService.currentLibraryId;
    this.bookId = this.booksService.currentBookId;
    this.bookAuthor = this.booksService.currentBookAuthor;
    this.bookTitle = this.booksService.currentBookTitle;
  }

  ngOnInit(): void {}

  ngAfterViewInit() {
    if (this.libraryId) this.getLibraryBooks();
    else if (this.bookId) this.getBookById();
    else if (this.bookTitle) this.getBooksByTitle();
    else if (this.bookAuthor) this.getBooksByAuthor();
    else this.errorMessage = "There has been an error while loading books";
  }


  public getNextPage(): void {
    this.pageNumber = this.pageNumber + 1;
    if (this.selectedOrder.value === "titleOrder") {
      this.sortBooksByTitle();
      return;
    }
    if (this.selectedOrder.value === "yearOrder") {
      this.sortBooksByYear();
      return;
    }
    if (this.libraryId) {
      this.getLibraryBooks();
      return;
    }
    if (this.bookTitle) {
      this.getBooksByTitle();
      return;
    }
    if (this.bookAuthor) {
      this.getBooksByAuthor();
      return;
    }
  }


  public getPreviousPage(): void {
    this.pageNumber = this.pageNumber - 1;
    if (this.selectedOrder.value === "titleOrder") {
      this.sortBooksByTitle();
      return;
    }
    if (this.selectedOrder.value === "yearOrder") {
      this.sortBooksByYear();
      return;
    }
    if (this.libraryId) {
      this.getLibraryBooks();
      return;
    }
    if (this.bookTitle) {
      this.getBooksByTitle();
      return;
    }
    if (this.bookAuthor) {
      this.getBooksByAuthor();
      return;
    }
  }


  public getFirstPage(): void {
    this.pageNumber = 1;
    if (this.selectedOrder.value === "titleOrder") {
      this.sortBooksByTitle();
      return;
    }
    if (this.selectedOrder.value === "yearOrder") {
      this.sortBooksByYear();
      return;
    }
    if (this.libraryId) {
      this.getLibraryBooks();
      return;
    }
    if (this.bookTitle) {
      this.getBooksByTitle();
      return;
    }
    if (this.bookAuthor) {
      this.getBooksByAuthor();
      return;
    }
  }


  public getLastPage(): void {
    this.pageNumber = this.totalPages;
    if (this.selectedOrder.value === "titleOrder") {
      this.sortBooksByTitle();
      return;
    }
    if (this.selectedOrder.value === "yearOrder") {
      this.sortBooksByYear();
      return;
    }
    if (this.libraryId) {
      this.getLibraryBooks();
      return;
    }
    if (this.bookTitle) {
      this.getBooksByTitle();
      return;
    }
    if (this.bookAuthor) {
      this.getBooksByAuthor();
      return;
    }
  }


  public getLibraryBooks(): void {
    if (this.libraryId) {
      this.booksService.getBooksByLibrary(this.libraryId, this.pageNumber, this.pageSize).subscribe((response) => {
        try {
          if (response.data.length === 0 || response === undefined) {
            throw ({ message: "No books where found in this library" });
          }
          else {
            this.books = new MatTableDataSource(response.data);
            this.displayedColumns = Object.keys(response.data[0]);
            this.length = response.totalRecords;
            this.totalPages = response.totalPages;
            this.totalRecords = response.totalRecords;
          }
        }
        catch (e: any) {
          this.errorMessage = e.message;
          setTimeout(() => {
            this.errorMessage = "";
            this.booksService.currentLibraryId = undefined;
            this.router.navigate(['Libraries']);
          }, 4000);
        }
      })
    }
  }


  public getBookById(): void {
    if (this.bookId) {
      this.booksService.getBookById(this.bookId).subscribe(response => {
        try {
          console.log(response)
          if (response.data.length === 0) throw ({ message: "No book was found, try with a different id"});
  
          this.books = new MatTableDataSource(response.data);
          this.displayedColumns = Object.keys(response.data[0]);
        }
        catch (e: any) {
          this.errorMessage = e.message;
          setTimeout(() => {
            this.errorMessage = "";
            this.booksService.currentBookId = undefined;
            this.router.navigate(['Libraries']);
          }, 4000);
        }
      })
    }
  }


  public getBooksByTitle(): void {
    if (this.bookTitle) {
      this.booksService.getBooksByTitle(this.bookTitle, this.pageNumber, this.pageSize).subscribe(response => {
        try {
          console.log(response)
          if (response.data.length === 0 || response === undefined) {
            throw ({ message: "No books where found with this title" });
          }
          this.books = new MatTableDataSource(response.data);
          this.displayedColumns = Object.keys(response.data[0]);
          this.length = response.totalRecords;
          this.totalPages = response.totalPages;
          this.totalRecords = response.totalRecords;
        }
        catch (e: any) {
          this.errorMessage = e.message;
          setTimeout(() => {
            this.errorMessage = "";
            this.booksService.currentBookTitle = undefined;
            this.router.navigate(['Libraries']);
          }, 4000);
        }
      });
    }
  }

  
  public getBooksByAuthor(): void {
    if (this.bookAuthor) {
      this.booksService.getBooksByAuthor(this.bookAuthor, this.pageNumber, this.pageSize).subscribe(response => {
        try {
          console.log(response)  
          if (response.data.length === 0 || response === undefined) {
            throw ({ message: "No books where found of this author" });
          }
          this.books = new MatTableDataSource(response.data);
          this.displayedColumns = Object.keys(response.data[0]);
          this.length = response.totalRecords;
          this.totalPages = response.totalPages;
          this.totalRecords = response.totalRecords;
        }
        catch (e: any) {
          this.errorMessage = e.message;
          setTimeout(() => {
            this.errorMessage = "";
            this.booksService.currentBookAuthor = undefined;
            this.router.navigate(['Libraries']);
          }, 4000);
        }
      });
    }
  }


  public goToLibraries(): void {
    this.booksService.currentLibraryId = undefined;
    this.booksService.currentBookId = undefined;
    this.booksService.currentBookTitle = undefined;
    this.booksService.currentBookAuthor = undefined;
    this.router.navigate(['Libraries']);
  }


  public goToEditMode(bookToEdit: Book): void {
    this.booksService.setCurrentBook(bookToEdit);
    this.router.navigate(["EditBook"]);
  }


  public orderChange(): void {
    this.pageNumber = 1;

    if (this.selectedOrder.value === "titleOrder") this.sortBooksByTitle();
    else if (this.selectedOrder.value === "yearOrder") this.sortBooksByYear();
    else {
      this.books = new MatTableDataSource(this.books.data);
      this.displayedColumns = Object.keys(this.books.data[0]);
    }
  }

  public pageSizeChange(): void {
    if (this.selectedPagination.value === "10") this.pageSize = 10;
    else if (this.selectedPagination.value === "25") this.pageSize = 25;
    else if (this.selectedPagination.value === "50") this.pageSize = 50;
    else if (this.selectedPagination.value === "100") this.pageSize = 100;
    
    let totalPages = Math.ceil(this.totalRecords / this.pageSize);
    if (totalPages < this.pageNumber) {
      console.log(this.pageNumber)
      this.pageNumber = totalPages;
    } else {
      console.log(this.pageNumber)
      this.pageNumber;
    }

    if (this.libraryId) this.getLibraryBooks();
    else if (this.bookId) this.getBookById();
    else if (this.bookTitle) this.getBooksByTitle();
    else if (this.bookAuthor) this.getBooksByAuthor();
    else this.errorMessage = "There has been an error while loading books";
  }

  
  public sortBooksByTitle(): void {
    let filter: Filter = 
      this.libraryId ? { filter: this.libraryId.toString(), filterType: "libraryId" } : 
      this.bookId ? { filter: this.bookId, filterType: "bookId" } : 
      this.bookTitle ? { filter: this.bookTitle, filterType: "bookTitle" } : 
      this.bookAuthor ? { filter: this.bookAuthor, filterType: "bookAuthor" } : 
      { filter: '', filterType: '' };

    this.booksService.sortBooksByTitle(filter, this.pageNumber, this.pageSize).subscribe(response => {
      try {
        console.log(response);
        if (response.data.length === 0 || response === undefined) {
          throw ({ message: "There's been an error while trying to sort books by title" });
        }

        this.books = new MatTableDataSource(response.data);
        this.displayedColumns = Object.keys(response.data[0]);
      }
      catch (e: any) {
        this.errorMessage = e.message;
        setTimeout(() => {
          this.errorMessage = "";
        }, 4000);
      }
    })
  }


  public sortBooksByYear(): void {
    let filter: Filter = 
      this.libraryId ? { filter: this.libraryId.toString(), filterType: "libraryId" } : 
      this.bookId ? { filter: this.bookId, filterType: "bookId" } : 
      this.bookTitle ? { filter: this.bookTitle, filterType: "bookTitle" } : 
      this.bookAuthor ? { filter: this.bookAuthor, filterType: "bookAuthor" } : 
      { filter: '', filterType: '' };
      
    this.booksService.sortBooksByYear(filter, this.pageNumber, this.pageSize).subscribe(response => {
      try {
        console.log(response);
        if (response.data.length === 0 || response === undefined) {
          throw ({ message: "There's been an error while trying to sort books by year" });
        }

        this.books = new MatTableDataSource(response.data);
        this.displayedColumns = Object.keys(response.data[0]);
      }
      catch (e: any) {
        this.errorMessage = e.message;
        setTimeout(() => {
          this.errorMessage = "";
          // this.selectedOrder.value = "";
          this.router.navigate(['Libraries']);
        }, 4000);
      }
    })
  }
}
