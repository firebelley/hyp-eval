import { Book } from 'src/model/book';
import * as faker from 'faker';

export function makeBook(): Book {
  return {
    title: faker.random.uuid(),
    author: `${faker.name.firstName()} ${faker.name.lastName()}`,
  };
}
