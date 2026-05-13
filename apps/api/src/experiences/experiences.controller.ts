import { Controller, Get, Query } from '@nestjs/common';

import { parseLocaleParam } from '../common/parse-locale-param';
import { ExperiencesService } from './experiences.service';

@Controller('experiences')
export class ExperiencesController {
  constructor(private readonly experiencesService: ExperiencesService) {}

  @Get()
  findAll(@Query('locale') locale?: string) {
    return this.experiencesService.findAll(parseLocaleParam(locale));
  }
}
