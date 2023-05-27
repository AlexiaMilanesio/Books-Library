import { Component, OnInit } from '@angular/core';
import { Book, Library, Filter } from 'src/app/models/models';
import { BookService } from 'src/app/services/book.service';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'app-books',
  templateUrl: './books.component.html',
  styleUrls: ['./books.component.scss'],
})
export class BooksComponent implements OnInit {
  libraries!: Library[];
  libraryId: number | undefined;
  bookId: string | undefined;
  bookTitle: string | undefined;
  bookAuthor: string | undefined;

  filter!: Filter;
  selectedOrder = new FormControl('');

  displayedColumns!: string[];
  books!: MatTableDataSource<Book>;
  
  length!: number;
  pageNumber: number = 1;
  lastPageNumber!: number;
  pageSize: number = 10;
  totalPages!: number;
  totalRecords!: number;
  selectedPagination = new FormControl('10');
  showPagination: boolean = true;

  errorMessage: string | undefined;


  constructor(private booksService: BookService, private router: Router) {
    this.booksService.getLibraries().subscribe((libraries) => {
      this.libraries = libraries.data;
    })

    this.libraryId = this.booksService.currentLibraryId;
    this.bookId = this.booksService.currentBookId;
    this.bookTitle = this.booksService.currentBookTitle;
    this.bookAuthor = this.booksService.currentBookAuthor;

    this.filter = this.libraryId
      ? { filter: this.libraryId.toString(), filterType: 'libraryId' }
      : this.bookId
      ? { filter: this.bookId, filterType: 'bookId' }
      : this.bookTitle
      ? { filter: this.bookTitle, filterType: 'bookTitle' }
      : this.bookAuthor
      ? { filter: this.bookAuthor, filterType: 'bookAuthor' }
      : { filter: '', filterType: '' };
  }

  ngOnInit(): void {}

  ngAfterViewInit() {
    this.getServerData();
  }


  public getServerData(): void {
    if (this.selectedOrder.value === 'titleOrder') {
      this.sortBooksByTitle();
      return;
    }
    else if (this.selectedOrder.value === 'yearOrder') {
      this.sortBooksByYear();
      return;
    } 
    else if (this.libraryId) {
      this.getLibraryBooks();
      return;
    } 
    else if (this.bookId) {
      this.getBookById();
      return;
    } 
    else if (this.bookTitle) {
      this.getBooksByTitle();
      return;
    } 
    else if (this.bookAuthor) {
      this.getBooksByAuthor();
      return;
    } 
    else {
      this.errorMessage = 'There has been an error while loading books, try again later';
    }
  }


  public getNextPage(): void {
    if (this.pageNumber < this.totalPages) this.pageNumber = this.pageNumber + 1;
    this.getServerData();
  }


  public getPreviousPage(): void {
    if (this.pageNumber > 1) this.pageNumber = this.pageNumber - 1;
    this.getServerData();
  }


  public getFirstPage(): void {
    this.pageNumber = 1;
    this.getServerData();
  }


  public getLastPage(): void {
    this.updateTotalPages();
    this.pageNumber = this.totalPages;
    this.getServerData();
  }


  public getLibraryName(id: number): string {
    let libraryName = this.libraries.find(library => library.id === id)?.name;
    return libraryName ? libraryName : "";
  }


  public getLibraryBooks(): void {
    if (this.libraryId) {
      this.booksService
        .getBooksByLibrary(this.libraryId, this.pageNumber, this.pageSize)
        .subscribe((response) => {
          try {
            if (response.data.length === 0 || response === undefined) {
              throw { message: 'No books where found in this library' }; 
            }
            
            this.books = new MatTableDataSource(response.data);
            this.displayedColumns = Object.keys(response.data[0]);
            this.length = response.totalRecords;
            this.totalPages = response.totalPages;
            this.totalRecords = response.totalRecords;
            window.scrollTo(0, 0);
          } 
          catch (e: any) {
            this.errorMessage = e.message;
          }
        });
    }
  }


  public getBookById(): void {
    this.showPagination = false;

    if (this.bookId) {
      this.booksService.getBookById(this.bookId).subscribe((response) => {
        try {
          console.log(response);
          if (response.data.length === 0) {
            throw { message: 'No book was found, try with a different id' };
          }

          this.books = new MatTableDataSource(response.data);
          this.displayedColumns = Object.keys(response.data[0]);
          window.scrollTo(0, 0);
        } 
        catch (e: any) {
          this.errorMessage = e.message;
        }
      });
    }
  }


  public getBooksByTitle(): void {
    if (this.bookTitle) {
      this.booksService
        .getBooksByTitle(this.bookTitle, this.pageNumber, this.pageSize)
        .subscribe((response) => {
          try {
            console.log(response);
            if (response.data.length === 0 || response === undefined) {
              throw { message: 'No books where found, try with a different title' };
            }
    
            this.books = new MatTableDataSource(response.data);
            this.displayedColumns = Object.keys(response.data[0]);
            this.length = response.totalRecords;
            this.totalPages = response.totalPages;
            this.totalRecords = response.totalRecords;
            window.scrollTo(0, 0);
          } 
          catch (e: any) {
            this.errorMessage = e.message;
          }
        });
    }
  }


  public getBooksByAuthor(): void {
    if (this.bookAuthor) {
      this.booksService
        .getBooksByAuthor(this.bookAuthor, this.pageNumber, this.pageSize)
        .subscribe((response) => {
          try {
            console.log(response);
            if (response.data.length === 0 || response === undefined) {
              throw { message: 'No books where found, try with a different author' };
            }

            this.books = new MatTableDataSource(response.data);
            this.displayedColumns = Object.keys(response.data[0]);
            this.length = response.totalRecords;
            this.totalPages = response.totalPages;
            this.totalRecords = response.totalRecords;
            window.scrollTo(0, 0);
          } 
          catch (e: any) {
            this.errorMessage = e.message;
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
    this.router.navigate(['EditBook']);
  }


  public orderChange(): void {
    this.pageNumber = 1;

    if (this.selectedOrder.value === 'titleOrder') {
      this.sortBooksByTitle();
      return;
    } 
    else if (this.selectedOrder.value === 'yearOrder') {
      this.sortBooksByYear();
      return;
    } 
    else {
      this.books = new MatTableDataSource(this.books.data);
      this.displayedColumns = Object.keys(this.books.data[0]);
    }
  }


  public pageSizeChange(): void {
    if (this.selectedPagination.value === '10') this.pageSize = 10;
    else if (this.selectedPagination.value === '25') this.pageSize = 25;
    else if (this.selectedPagination.value === '50') this.pageSize = 50;
    else if (this.selectedPagination.value === '100') this.pageSize = 100;

    this.updateTotalPages();
    this.getServerData();
  }


  public updateTotalPages() {
    this.totalPages = Math.ceil(this.totalRecords / this.pageSize);

    if (this.totalPages < this.pageNumber) this.pageNumber = this.totalPages;
    else this.pageNumber;
  }


  public sortBooksByTitle(): void {
    this.booksService
      .sortBooksByTitle(this.filter, this.pageNumber, this.pageSize)
      .subscribe((response) => {
        try {
          console.log(response);
          if (response.data.length === 0 || response === undefined) {
            throw { message: "There's been an error while trying to sort books by title, try again later" };
          }

          this.books = new MatTableDataSource(response.data);
          this.displayedColumns = Object.keys(response.data[0]);
          window.scrollTo(0, 0);
        } catch (e: any) {
          this.errorMessage = e.message;
        }
      });
  }


  public sortBooksByYear(): void {
    this.booksService
      .sortBooksByYear(this.filter, this.pageNumber, this.pageSize)
      .subscribe((response) => {
        try {
          console.log(response);
          if (response.data.length === 0 || response === undefined) {
            throw { message: "There's been an error while trying to sort books by year, try again later" };
          }

          this.books = new MatTableDataSource(response.data);
          this.displayedColumns = Object.keys(response.data[0]);
          window.scrollTo(0, 0);
        } 
        catch (e: any) {
          this.errorMessage = e.message;
        }
      });
  }
}
