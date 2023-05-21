export interface Book {
  isbn: string;
  title: string;
  year: number;
  publisher: string;
  image_url: string;
  libraryId: number;
  authorId: number;
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

export interface LibrariesResponse {
  data: Library[];
  succeded: boolean;
  errors: null;
  message: string;
}
