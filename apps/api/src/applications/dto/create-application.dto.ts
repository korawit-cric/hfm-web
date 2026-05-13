import { ApiProperty } from '@nestjs/swagger';

export class CreateApplicationDto {
  @ApiProperty({
    example: 'Jane',
    description: 'Given name',
  })
  firstName: string;

  @ApiProperty({
    example: 'Doe',
    description: 'Family name',
  })
  lastName: string;

  @ApiProperty({
    example: 1,
    description: 'FK to `countries.id`',
    minimum: 1,
  })
  countryId: number;

  @ApiProperty({
    example: '+66',
    description:
      'E.164-style dialing prefix; must match a code linked to `countryId`',
  })
  phoneCode: string;

  @ApiProperty({
    example: '812345678',
    description:
      'National number (stored with prefix as full phone on the row)',
  })
  phone: string;

  @ApiProperty({
    example: 'jane.doe@example.com',
    format: 'email',
  })
  email: string;

  @ApiProperty({
    example: 1,
    description: 'FK to `experiences.id`',
    minimum: 1,
  })
  experienceId: number;

  @ApiProperty({
    example: true,
    description: 'Must be true to submit (terms / consent)',
  })
  consent: boolean;
}
