import { AppController } from './app.controller';
import { AppService } from './app.service';
import { makeBook } from '../test/helpers/makeBook';

describe('AppController', () => {
  let subject: AppController;
  let appService: AppService;

  beforeEach(async () => {
    appService = new AppService();
    subject = new AppController(appService);
  });

  afterAll(() => {
    jest.clearAllMocks();
  });

  describe('GET findByAuthor', () => {
    it('should call appService with no author', () => {
      const book1 = makeBook();
      const book2 = makeBook();
      appService.findByAuthor = jest.fn().mockReturnValue([book1, book2]);

      const result = subject.findByAuthor();
      expect(result).toHaveLength(2);
      expect(appService.findByAuthor).toBeCalledWith(undefined);
    });

    it('should call appService with supplied author', () => {
      const book = makeBook();
      appService.findByAuthor = jest.fn().mockReturnValue([book]);

      const result = subject.findByAuthor(book.author);
      expect(result).toHaveLength(1);
      expect(appService.findByAuthor).toHaveBeenCalledWith(book.author);
    });
  });

  describe('POST create', () => {
    it('should call appService create with supplied book', () => {
      const bookToCreate = makeBook();
      appService.create = jest.fn().mockReturnValue(bookToCreate);
      subject.create(bookToCreate);
      expect(appService.create).toHaveBeenCalledWith(bookToCreate);
    });

    it('should throw error when appService fails to create', () => {
      const bookToCreate = makeBook();
      appService.create = jest.fn().mockImplementation(() => {
        throw new Error('Some error');
      });

      expect(() => {
        subject.create(bookToCreate);
      }).toThrow('Some error');
    });
  });
});
