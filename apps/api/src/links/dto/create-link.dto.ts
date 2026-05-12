import { ApiProperty } from '@nestjs/swagger';

import { LinkTranslationInputDto } from './link-translation-input.dto';

export class CreateLinkDto {
  @ApiProperty({ example: 'https://example.com' })
  url: string;

  @ApiProperty({
    type: [LinkTranslationInputDto],
    description: 'At least one locale (typically en and th)',
  })
  translations: LinkTranslationInputDto[];
}
