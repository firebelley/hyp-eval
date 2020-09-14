import { Injectable } from '@nestjs/common';
import { Book } from './model/book';

@Injectable()
export class AppService {
  private readonly database: Book[] = [];

  public create(book: Book): Book {
    const trimmedTitle = book.title.trim();
    const trimmedAuthor = book.author.trim();

    if (trimmedTitle.length < 1) {
      throw new Error('Title must have at least 1 character.');
    }
    if (trimmedAuthor.length < 2) {
      throw new Error('Author must have at least 2 characters.');
    }

    // Ideally we'd want to use a unique ID like an ISBN
    // for indentifying the same book within the DB.
    // Checking against an arbitrary string value is generally very brittle.
    if (
      this.database.some(
        (book) => book.title.toLowerCase() === trimmedTitle.toLowerCase(),
      )
    ) {
      throw new Error(`Book with title '${trimmedTitle}' already exists.`);
    }
    const bookToInsert: Book = {
      // this "...book" is uncessary for this scenario
      // but I like to include it in case the "Book" type
      // gets expanded. That way no data will be lost.
      // Alternatively I could have mutated the incoming book object
      // but I personally prefer to create new copies of objects that
      // are being modified.
      ...book,
      author: trimmedAuthor,
      title: trimmedTitle,
    };
    this.database.push(bookToInsert);
    return bookToInsert;
  }

  public findByAuthor(author?: string): Book[] {
    let searchResult = this.database;
    if (author) {
      searchResult = searchResult.filter(
        (book) => book.author.toLowerCase() === author.trim().toLowerCase(),
      );
    }
    return searchResult.sort((a, b) => {
      return a.title.localeCompare(b.title);
    });
  }
}
