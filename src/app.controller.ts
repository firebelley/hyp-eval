import {
  Controller,
  Get,
  Post,
  Body,
  Query,
  BadRequestException,
} from '@nestjs/common';
import { AppService } from './app.service';
import { Book } from './model/book';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  findByAuthor(@Query('author') author?: string): Book[] {
    return this.appService.findByAuthor(author);
  }

  // Normally I would use a DTO here, but in this case the class is small enough
  // and a DTO would be basically identical.
  // I would go for a DTO if we needed different/additional validation on the request
  // side than we needed on the DB side.
  @Post('create')
  create(@Body() book: Book): Book {
    try {
      return this.appService.create(book);
    } catch (e) {
      // Could use any number of 4xx responses here.
      // I chose BadRequest 400 because there are several different constraints
      // that can cause creation to fail.
      throw new BadRequestException(e.message);
    }
  }
}
