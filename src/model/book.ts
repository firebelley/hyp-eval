import { IsString, Length } from "class-validator";

export class Book {
  @IsString()
  @Length(1)
  title: string;

  @IsString()
  @Length(2)
  author: string;
};
