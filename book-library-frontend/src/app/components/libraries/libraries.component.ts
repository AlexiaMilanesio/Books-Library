import { Component, OnInit, ViewChild } from '@angular/core';
import { BookService } from 'src/app/services/book.service';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { Library, Book } from 'src/app/models/models';

@Component({
  selector: 'app-libraries',
  templateUrl: './libraries.component.html',
  styleUrls: ['./libraries.component.scss'],
})
export class LibrariesComponent implements OnInit {
  @ViewChild('paginator') paginator!: MatPaginator;
  displayedColumns!: string[];
  libraries!: MatTableDataSource<Library>;
  books!: MatTableDataSource<any>;
  length!: number;
  pageSize!: number;
  pageEvent: PageEvent | undefined;
  libraryId!: number; 
  errorMessage: string | undefined;

  constructor(private booksService: BookService) {}

  ngOnInit(): void {
    this.getLibraries();
  }

  public getLibraries(): void {
    this.booksService.getLibraries().subscribe((libraries) => {
      try {
        this.libraries = new MatTableDataSource(libraries.data);
        this.displayedColumns = Object.keys(libraries.data[0]);

        if (libraries.data.length === 0 || libraries === undefined) throw ({ message: "There's been an error: no libraries where found" });
      }
      catch (e: any) {
        this.errorMessage = e.message;
      }
    });
  }

  public getServerData(event?: PageEvent): PageEvent | undefined {
    this.searchLibraryBooks();
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
        let idExists = this.libraries.data.find((library: Library) => library.id === this.libraryId);
          
        if (idExists === undefined) throw ({ message: "Id doesn't exists, try a different one" });
        if (books.data.length === 0 || books === undefined) throw ({ message: "No books where found in this library" });

        this.books = new MatTableDataSource(books.data);
        this.books.paginator = this.paginator;
        this.displayedColumns = Object.keys(books.data[0]);
        this.length = books.data.length;
      }
      catch (e: any) {
        this.errorMessage = e.message;
        setTimeout(() => {
          this.errorMessage = "" 
          this.getLibraries();
        }, 4000);
      }
    })
  }

  public resetSearch(): void {
    this.books.data = [];
    this.getLibraries();
  }
}
