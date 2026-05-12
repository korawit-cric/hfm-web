import { Controller, Get, Param, Query } from '@nestjs/common';

import { parseLocaleParam } from '../common/parse-locale-param';
import { FaqsService } from './faqs.service';

@Controller('faqs')
export class FaqsController {
  constructor(private readonly faqsService: FaqsService) {}

  @Get()
  findAll(@Query('locale') locale?: string) {
    return this.faqsService.findAll(parseLocaleParam(locale));
  }

  @Get(':id')
  findOne(@Param('id') id: string, @Query('locale') locale?: string) {
    return this.faqsService.findOne(+id, parseLocaleParam(locale));
  }
}
