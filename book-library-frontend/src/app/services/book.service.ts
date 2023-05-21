import { Injectable } from '@angular/core';
import { Book, BooksResponse, LibrariesResponse, AuthorsResponse } from '../models/models';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class BookService {
  URL: string = "https://localhost:7156/Books/";
  currentBook!: Book;

  constructor(private httpClient: HttpClient) {}

  getBooks(): Observable<BooksResponse> {
    return this.httpClient.get<BooksResponse>(this.URL + 'GetBooks');
  }

  getAllBooks(): Observable<BooksResponse> {
    return this.httpClient.get<BooksResponse>(this.URL + 'GetAllBooks');
  }

  getLibraries(): Observable<LibrariesResponse> {
    return this.httpClient.get<LibrariesResponse>(this.URL + 'GetLibraries');
  }

  getBooksByLibrary(libraryId: number): Observable<BooksResponse> {
    return this.httpClient.get<BooksResponse>(this.URL + 'GetBooksByLibrary/' + libraryId);
  }

  getBookById(bookId: string): Observable<BooksResponse> {
    return this.httpClient.get<BooksResponse>(this.URL + 'GetBookById/' + bookId);
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

  setCurrentBook(currentBook: Book) {
    this.currentBook = currentBook;
  }
}
