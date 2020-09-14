import * as request from 'supertest';
import { Test } from '@nestjs/testing';
import { AppModule } from './../src/app.module';
import { INestApplication } from '@nestjs/common';
import { makeBook } from './helpers/makeBook';

describe('AppController (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  it('/ (GET) with no records', () => {
    return request(app.getHttpServer()).get('/').expect(200).expect([]);
  });

  it('/create (POST) new record', () => {
    const book = makeBook();
    return request(app.getHttpServer())
      .post('/create')
      .send(book)
      .expect(201)
      .expect(book);
  });

  it('/create POST throws 409 for duplicate resource', async () => {
    const book = makeBook();
    await request(app.getHttpServer())
      .post('/create')
      .send(book)
      .expect(201)
      .expect(book);

    return request(app.getHttpServer()).post('/create').send(book).expect(409);
  });

  it('/ (GET) with records', async () => {
    const response = await request(app.getHttpServer()).get('/').expect(200);
    expect(response.body).toHaveLength(2);
  });

  it('/ (GET) by author name sorted asc by title', async () => {
    const book1 = makeBook();
    book1.author = 'jacob';
    book1.title = 'Book A';
    const book2 = makeBook();
    book2.author = 'JACOB';
    book2.title = 'Book B';

    await request(app.getHttpServer()).post('/create').send(book2).expect(201);

    await request(app.getHttpServer()).post('/create').send(book1).expect(201);

    return request(app.getHttpServer())
      .get('/')
      .query({ author: 'jacob' })
      .expect(200)
      .expect([book1, book2]);
  });
});
