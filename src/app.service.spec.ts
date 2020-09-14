import { makeBook } from '../test/helpers/makeBook';
import { AppService } from './app.service';
import * as faker from 'faker';
import { Book } from './model/book';

function saveBooks(service: AppService, books: Book[]) {
  books.forEach((book) => {
    service.create(book);
  });
}

describe('AppService', () => {
  let subject: AppService;

  beforeEach(async () => {
    subject = new AppService();
  });

  afterAll(() => {
    jest.clearAllMocks();
  });

  describe('create book', () => {
    it('should create a book and return it', () => {
      const bookToCreate = makeBook();
      const result = subject.create(bookToCreate);
      expect(result).toEqual(bookToCreate);
    });

    it('should trim author name', () => {
      const bookToCreate = makeBook();
      const newAuthor = faker.random.words();
      bookToCreate.author = `   ${newAuthor}   `;
      const result = subject.create(bookToCreate);
      expect(result.author).toEqual(newAuthor);
    });

    it('should trim title', () => {
      const bookToCreate = makeBook();
      const newTitle = faker.random.words();
      bookToCreate.title = ` ${newTitle}  `;
      const result = subject.create(bookToCreate);
      expect(result.title).toEqual(newTitle);
    });

    it('should throw error for duplicate record', () => {
      const bookToCreate = makeBook();
      subject.create(bookToCreate);
      expect(() => {
        subject.create(bookToCreate);
      }).toThrowError(
        `Book with title '${bookToCreate.title}' already exists.`,
      );
    });

    it('should throw error for small title', () => {
      const bookToCreate = makeBook();
      bookToCreate.title = '';
      expect(() => {
        subject.create(bookToCreate);
      }).toThrowError('Title must have at least 1 character.');
    });

    it('should throw error for small author name', () => {
      const bookToCreate = makeBook();
      bookToCreate.author = 'j';
      expect(() => {
        subject.create(bookToCreate);
      }).toThrowError('Author must have at least 2 characters.');
    });
  });

  describe('find by author', () => {
    it('should list all books if no author provided', () => {
      saveBooks(subject, [makeBook(), makeBook(), makeBook()]);
      const result = subject.findByAuthor();
      expect(result).toHaveLength(3);
    });

    it('should sort all books by title', () => {
      const book1 = makeBook();
      book1.title = 'Another book on the shelf';
      const book2 = makeBook();
      book2.title = 'Beekeeping';
      const book3 = makeBook();
      book3.title = 'Cats and more';

      saveBooks(subject, [book3, book1, book2]);
      const result = subject.findByAuthor();
      expect(result).toEqual([book1, book2, book3]);
    });

    it('should filter by supplied author', () => {
      const author = 'Jacob';
      const book1 = makeBook();
      book1.author = author;
      const book2 = makeBook();
      book2.author = author;

      saveBooks(subject, [makeBook(), book1, makeBook(), book2, makeBook()]);
      const result = subject.findByAuthor(author);
      expect(result).toHaveLength(2);
    });

    it('should search with trimmed author string', () => {
      const author = 'Jacob   ';
      const book = makeBook();
      book.author = 'Jacob';

      saveBooks(subject, [makeBook(), makeBook(), book]);
      const result = subject.findByAuthor(author);
      expect(result).toEqual([book]);
    });

    it('should search with lowercased author string', () => {
      const book = makeBook();
      book.author = 'JACOB';

      saveBooks(subject, [makeBook(), book, makeBook()]);
      const result = subject.findByAuthor('jacob');
      expect(result).toEqual([book]);
    });

    it('should sort book titles filtered by author', () => {
      const book1 = makeBook();
      book1.author = 'Jacob';
      book1.title = 'Title First';
      const book2 = makeBook();
      book2.author = 'jacob';
      book2.title = 'Title Last';

      saveBooks(subject, [makeBook(), book2, makeBook(), makeBook(), book1]);
      const result = subject.findByAuthor('jacob');
      expect(result).toHaveLength(2);
      expect(result).toEqual([book1, book2]);
    });
  });
});
