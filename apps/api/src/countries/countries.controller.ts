import { Controller, Get, Query } from '@nestjs/common';

import { parseLocaleParam } from '../common/parse-locale-param';
import { CountriesService } from './countries.service';

@Controller('countries')
export class CountriesController {
  constructor(private readonly countriesService: CountriesService) {}

  @Get()
  findAll(@Query('locale') locale?: string) {
    return this.countriesService.findAll(parseLocaleParam(locale));
  }
}
