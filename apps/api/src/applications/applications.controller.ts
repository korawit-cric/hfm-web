import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
} from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiBody,
  ApiCreatedResponse,
  ApiInternalServerErrorResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiTags,
} from '@nestjs/swagger';

import {
  BadRequestApplicationErrorDto,
  InternalServerApplicationErrorDto,
  NotFoundApplicationErrorDto,
} from './dto/application-error.dto';
import { ApplicationResponseDto } from './dto/application-response.dto';
import { CreateApplicationDto } from './dto/create-application.dto';
import { ApplicationsService } from './applications.service';

@ApiTags('applications')
@Controller('applications')
export class ApplicationsController {
  constructor(private readonly applicationsService: ApplicationsService) {}

  @Get()
  @ApiOperation({ summary: 'List all submitted applications' })
  @ApiOkResponse({
    description: 'Applications ordered by id ascending',
    type: ApplicationResponseDto,
    isArray: true,
  })
  findAll() {
    return this.applicationsService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get one application by id' })
  @ApiParam({
    name: 'id',
    description: 'Application primary key',
    example: 1,
    type: Number,
  })
  @ApiOkResponse({
    type: ApplicationResponseDto,
  })
  @ApiBadRequestResponse({
    description: 'Invalid id (not a positive integer)',
    type: BadRequestApplicationErrorDto,
  })
  @ApiNotFoundResponse({
    description: 'No application with this id',
    type: NotFoundApplicationErrorDto,
  })
  findOne(@Param('id') id: string) {
    return this.applicationsService.findOne(Number(id));
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create an application (signup / lead capture)' })
  @ApiBody({ type: CreateApplicationDto })
  @ApiCreatedResponse({
    description: 'Row created',
    type: ApplicationResponseDto,
  })
  @ApiBadRequestResponse({
    description: 'Validation failed, or phone code does not match country',
    type: BadRequestApplicationErrorDto,
  })
  @ApiInternalServerErrorResponse({
    description: 'Persistence failure',
    type: InternalServerApplicationErrorDto,
  })
  create(@Body() body: CreateApplicationDto) {
    return this.applicationsService.create(body);
  }
}
