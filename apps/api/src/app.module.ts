import { Module } from '@nestjs/common';

import { CountriesModule } from './countries/countries.module';
import { ExperiencesModule } from './experiences/experiences.module';
import { FaqsModule } from './faqs/faqs.module';
import { LinksModule } from './links/links.module';
import { PrizesModule } from './prizes/prizes.module';
import { PrismaModule } from './prisma/prisma.module';
import { RankingsModule } from './rankings/rankings.module';

import { AppService } from './app.service';
import { AppController } from './app.controller';

@Module({
  imports: [
    PrismaModule,
    LinksModule,
    CountriesModule,
    ExperiencesModule,
    RankingsModule,
    FaqsModule,
    PrizesModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
