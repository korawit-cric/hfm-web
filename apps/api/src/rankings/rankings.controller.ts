import { Controller, Get, Param, Query } from '@nestjs/common';

import { parseLocaleParam } from '../common/parse-locale-param';
import { RankingsService } from './rankings.service';

@Controller('rankings')
export class RankingsController {
  constructor(private readonly rankingsService: RankingsService) {}

  @Get()
  findAll(@Query('locale') locale?: string) {
    return this.rankingsService.findAll(parseLocaleParam(locale));
  }

  @Get(':id')
  findOne(@Param('id') id: string, @Query('locale') locale?: string) {
    return this.rankingsService.findOne(+id, parseLocaleParam(locale));
  }
}
