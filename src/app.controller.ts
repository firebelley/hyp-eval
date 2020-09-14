import { Controller, Get, Post, Body, Query } from '@nestjs/common';
@Controller()
export class AppController {
  private db = [];

  @Get()
  find(@Query('search') input?) {
    if (!input) {
      return this.db.sort((a, b) => {
        if (a.title < b.title) {
          return 1;
        }
        if (a.title > b.title) {
          return -1;
        }
        return 0;
      });
    }
    return this.db
      .filter((x) => x.author === input)
      .sort((a, b) => {
        if (a.title < b.title) {
          return 1;
        }
        if (a.title > b.title) {
          return -1;
        }
        return 0;
      });
  }

  @Post('create')
  create(@Body() input) {
    // don't allow duplicates
    if (this.db.some((x) => x.title === input.title)) {
      return false;
    }
    return this.db.push(input);
  }
}
