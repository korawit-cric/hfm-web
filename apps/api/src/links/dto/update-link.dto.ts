import { ApiProperty } from '@nestjs/swagger';

import { LinkTranslationInputDto } from './link-translation-input.dto';

export class UpdateLinkDto {
  @ApiProperty({ required: false })
  url?: string;

  @ApiProperty({ type: [LinkTranslationInputDto], required: false })
  translations?: LinkTranslationInputDto[];
}
