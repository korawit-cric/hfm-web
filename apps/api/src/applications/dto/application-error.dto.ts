import { ApiProperty } from '@nestjs/swagger';

/** Nested `message` object for structured 4xx/5xx responses from this module. */
export class ApplicationErrorPayloadDto {
  @ApiProperty({
    description: 'Machine-readable error code',
    enum: ['VALIDATION', 'INVALID_CODE', 'DB_ERROR'],
    example: 'VALIDATION',
  })
  error: string;
}

/** Typical NestJS `BadRequestException` JSON body for this controller. */
export class BadRequestApplicationErrorDto {
  @ApiProperty({ example: 400 })
  statusCode: number;

  @ApiProperty({ example: 'Bad Request' })
  error: string;

  @ApiProperty({
    type: ApplicationErrorPayloadDto,
    description:
      'Structured failure (e.g. VALIDATION, INVALID_CODE) when thrown with an object',
  })
  message: ApplicationErrorPayloadDto;
}

/** Typical `NotFoundException` body when an application id does not exist. */
export class NotFoundApplicationErrorDto {
  @ApiProperty({ example: 404 })
  statusCode: number;

  @ApiProperty({ example: 'Not Found' })
  error: string;

  @ApiProperty({
    example: 'Application with ID 99 not found',
  })
  message: string;
}

/** Typical `InternalServerErrorException` body when persistence fails. */
export class InternalServerApplicationErrorDto {
  @ApiProperty({ example: 500 })
  statusCode: number;

  @ApiProperty({ example: 'Internal Server Error' })
  error: string;

  @ApiProperty({
    type: ApplicationErrorPayloadDto,
    example: { error: 'DB_ERROR' },
  })
  message: ApplicationErrorPayloadDto;
}
