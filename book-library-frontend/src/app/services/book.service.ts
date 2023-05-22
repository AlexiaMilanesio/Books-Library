import { Injectable } from '@angular/core';
import { Book, BooksResponse, PagedBooksResponse, LibrariesResponse, Filter } from '../models/models';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class BookService {
  URL: string = 'https://localhost:7156/Books/';
  currentBook!: Book;
  currentLibraryId: number | undefined;
  currentBookId: string | undefined;
  currentBookTitle!: string | undefined;
  currentBookAuthor: string | undefined;

  constructor(private httpClient: HttpClient) {}

  getLibraries(): Observable<LibrariesResponse> {
    return this.httpClient.get<LibrariesResponse>(this.URL + 'GetLibraries');
  }

  getBooksByLibrary(libraryId: number, pageNumber: number, pageSize: number): Observable<PagedBooksResponse> {
    return this.httpClient.get<PagedBooksResponse>(this.URL + 'GetBooksByLibrary/' + libraryId + '?pageNumber=' + pageNumber + '&pageSize=' + pageSize);
  }

  getBookById(bookId: string): Observable<BooksResponse> {
    return this.httpClient.get<BooksResponse>(this.URL + 'GetBookById/' + bookId);
  }

  getBooksByTitle(bookTitle: string, pageNumber: number, pageSize: number): Observable<PagedBooksResponse> {
    return this.httpClient.get<PagedBooksResponse>(this.URL + 'GetBooksByTitle/' + bookTitle + '?pageNumber=' + pageNumber + '&pageSize=' + pageSize);
  }

  getBooksByAuthor(bookAuthor: string, pageNumber: number, pageSize: number): Observable<PagedBooksResponse> {
    return this.httpClient.get<PagedBooksResponse>(this.URL + 'GetBooksByAuthor/' + bookAuthor + '?pageNumber=' + pageNumber + '&pageSize=' + pageSize);
  }

  sortBooksByTitle(filter: Filter, pageNumber: number, pageSize: number): Observable<PagedBooksResponse> {
    return this.httpClient.post<PagedBooksResponse>(this.URL + 'SortBooksByTitle?pageNumber=' + pageNumber + '&pageSize=' + pageSize, filter);
  }

  sortBooksByYear(filter: Filter, pageNumber: number, pageSize: number): Observable<PagedBooksResponse> {
    return this.httpClient.post<PagedBooksResponse>(this.URL + 'SortBooksByYear?pageNumber=' + pageNumber + '&pageSize=' + pageSize, filter);
  }

  addBook(newBook: Book): Observable<Book> {
    return this.httpClient.post<Book>(this.URL + 'AddBook', newBook);
  }

  editBook(editedBook: Book): Observable<Book> {
    return this.httpClient.put<Book>(this.URL + 'EditBook', editedBook);
  }

  deleteBook(bookId: string): Observable<Book> {
    return this.httpClient.delete<Book>(this.URL + 'DeleteBook/' + bookId);
  }

  // Setters

  setCurrentBook(currentBook: Book) {
    this.currentBook = currentBook;
  }

  setCurrentLibraryId(currentLibraryId: number) {
    this.currentLibraryId = currentLibraryId;
  }

  setCurrentBookId(currentBookId: string) {
    this.currentBookId = currentBookId;
  }

  setCurrentBookAuthor(currentBookAuthor: string) {
    this.currentBookAuthor = currentBookAuthor;
  }

  setCurrentBookTitle(currentBookTitle: string) {
    this.currentBookTitle = currentBookTitle;
  }
}
