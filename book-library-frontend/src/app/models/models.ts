export interface Book {
  isbn: string;
  title: string;
  year: number;
  publisher: string;
  image_url: string;
  libraryId: number;
  author: string;
}

export interface Library {
  id: number;
  name: string;
  address: string;
  city: string;
}

export interface Author {
  id: number;
  name: string;
  year: number;
}

export interface BooksResponse {
  data: Book[];
  succeded: boolean;
  errors: null;
  message: string;
}

export interface PagedBooksResponse {
  pageNumber: number;
  pageSize: number;
  firstPage: number;
  lastPage: number;
  totalPages: number;
  totalRecords: number;
  nextPage: number;
  previousPage: number;
  data: Book[];
  succeeded: true;
  errors: null;
  message: string;
}

export interface LibrariesResponse {
  data: Library[];
  succeded: boolean;
  errors: null;
  message: string;
}

export interface Filter {
  filter: string;
  filterType: string;
}

export interface User {
  name: string;
  lastname: string;
  email: string;
  password: string;
}
