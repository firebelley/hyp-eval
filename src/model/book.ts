// When using an actual DB, we'd want to make this an
// entity class that's used with an ORM of some sort.
// Since we're using an in-memory database, a simple type seems
// appropriate here.
export type Book = {
  title: string;
  author: string;
};
