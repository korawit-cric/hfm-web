import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';

import {
  ApplicationsService,
  type CreateApplicationDto,
} from './applications.service';

@Controller('applications')
export class ApplicationsController {
  constructor(private readonly applicationsService: ApplicationsService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  create(@Body() body: CreateApplicationDto) {
    return this.applicationsService.create(body);
  }
}
