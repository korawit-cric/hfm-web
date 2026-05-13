import { Controller, Get, Param, Query } from '@nestjs/common';

import { parseLocaleParam } from '../common/parse-locale-param';
import { PrizesService } from './prizes.service';

@Controller('prizes')
export class PrizesController {
  constructor(private readonly prizesService: PrizesService) {}

  @Get()
  findAll(@Query('locale') locale?: string) {
    return this.prizesService.findAll(parseLocaleParam(locale));
  }

  @Get(':id')
  findOne(@Param('id') id: string, @Query('locale') locale?: string) {
    return this.prizesService.findOne(+id, parseLocaleParam(locale));
  }
}
