import { Injectable } from '@angular/core';
import { Book, BooksResponse, PagedBooksResponse, LibrariesResponse } from '../models/models';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class BookService {
  URL: string = "https://localhost:7156/Books/";
  currentBook!: Book;
  currentLibraryId!: number;
  currentAuthorName!: string;
  currentBookTitle!: string;

  constructor(private httpClient: HttpClient) {}

  // getBooks(): Observable<BooksResponse> {
  //   return this.httpClient.get<BooksResponse>(this.URL + 'GetBooks');
  // }

  // getAllBooks(): Observable<BooksResponse> {
  //   return this.httpClient.get<BooksResponse>(this.URL + 'GetAllBooks');
  // }

  getLibraries(): Observable<LibrariesResponse> {
    return this.httpClient.get<LibrariesResponse>(this.URL + 'GetLibraries');
  }

  getBooksByLibrary(libraryId: number, pageNumber: number, pageSize: number): Observable<PagedBooksResponse> {
    return this.httpClient.get<PagedBooksResponse>(this.URL + 'GetBooksByLibrary/' + libraryId + "?pageNumner=" + pageNumber + "&pageSize=" + pageSize);
  }

  getBooksByAuthor(bookAuthor: string): Observable<BooksResponse> {
    return this.httpClient.get<BooksResponse>(this.URL + 'GetBookById/' + bookAuthor);
  }

  getBookById(bookId: string): Observable<BooksResponse> {
    return this.httpClient.get<BooksResponse>(this.URL + 'GetBookById/' + bookId);
  }

  getBookByTitle(bookTitle: string): Observable<BooksResponse> {
    return this.httpClient.get<BooksResponse>(this.URL + 'GetBookById/' + bookTitle);
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

  setCurrentAuthorName(currentAuthorName: string) {
    this.currentAuthorName = currentAuthorName;
  }

  setCurrentBookTitle(currentBookTitle: string) {
    this.currentBookTitle = currentBookTitle;
  }
}
