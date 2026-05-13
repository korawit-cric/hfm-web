import { ApiProperty } from '@nestjs/swagger';

export class ApplicationResponseDto {
  @ApiProperty({
    example: 42,
    description: 'Persisted application primary key',
  })
  id: number;

  @ApiProperty({ example: 'Jane' })
  firstName: string;

  @ApiProperty({ example: 'Doe' })
  lastName: string;

  @ApiProperty({
    example: 1,
    description: 'FK to `countries.id`',
  })
  countryId: number;

  @ApiProperty({
    example: 3,
    description: 'FK to `codes.id` (resolved from phone prefix + country)',
  })
  codeId: number;

  @ApiProperty({
    example: 2,
    description: 'FK to `experiences.id`',
  })
  experienceId: number;

  @ApiProperty({
    example: '+66 812345678',
    description: 'Combined dial prefix and national number as stored',
  })
  phone: string;

  @ApiProperty({ example: 'jane.doe@example.com', format: 'email' })
  email: string;

  @ApiProperty({
    example: true,
    description: 'Whether the user accepted terms at submission time',
  })
  consent: boolean;
}
