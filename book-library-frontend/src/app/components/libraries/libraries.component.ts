import { Component, OnInit, ViewChild } from '@angular/core';
import { BookService } from 'src/app/services/book.service';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { Library } from 'src/app/models/models';
import { Router } from '@angular/router';

@Component({
  selector: 'app-libraries',
  templateUrl: './libraries.component.html',
  styleUrls: ['./libraries.component.scss'],
})
export class LibrariesComponent implements OnInit {
  @ViewChild('paginator') paginator!: MatPaginator;
  displayedColumns!: string[];
  libraries!: MatTableDataSource<Library>;
  errorMessage: string | undefined;

  
  constructor(private booksService: BookService, private router: Router) {}

  ngOnInit(): void {}

  ngAfterViewInit() {
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


  public getLibraryBooks(library: Library): void {
    const id = library.id;
    const idExists = this.libraries.data.find((library: Library) => library.id === Number(id));
    
    if (idExists === undefined) {
      throw ({ message: "Id doesn't exists, try a different one" });
    }

    this.booksService.currentLibraryId = Number(id);
    this.router.navigate(["/Books"]);
  }


  public getBooksByAuthor(authorName: string): void {
    if (authorName === "" || authorName === " ") return;
    this.booksService.currentAuthorName = authorName;
    this.router.navigate(["/Books"]);
  }


  public getBooksByTitle(bookTitle: string): void {
    if (bookTitle === "" || bookTitle === " ") return;
    this.booksService.currentBookTitle = bookTitle;
    this.router.navigate(["/Books"]);
  }
}
