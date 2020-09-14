import {
  Controller,
  Get,
  Post,
  Body,
  Query,
  ConflictException,
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
      // There seems to be no set agreement on the proper response code for a POST
      // that would create a duplicate resource.
      // I chose Conflict 409 because that seemed most appropriate for this scenario.
      throw new ConflictException(e.message);
    }
  }
}
