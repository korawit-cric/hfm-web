import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
} from '@nestjs/common';

import { LinksService } from './links.service';
import { CreateLinkDto } from './dto/create-link.dto';
import { UpdateLinkDto } from './dto/update-link.dto';
import { parseLocaleParam } from './locale';

@Controller('links')
export class LinksController {
  constructor(private readonly linksService: LinksService) {}

  @Post()
  create(@Body() data: CreateLinkDto) {
    return this.linksService.create(data);
  }

  @Get()
  findAll(@Query('locale') locale?: string) {
    return this.linksService.findAll(parseLocaleParam(locale));
  }

  @Get(':id')
  findOne(@Param('id') id: string, @Query('locale') locale?: string) {
    return this.linksService.findOne(+id, parseLocaleParam(locale));
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Query('locale') locale: string | undefined,
    @Body() data: UpdateLinkDto,
  ) {
    return this.linksService.update(+id, data, parseLocaleParam(locale));
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.linksService.remove(+id);
  }
}
