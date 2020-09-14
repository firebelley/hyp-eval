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
