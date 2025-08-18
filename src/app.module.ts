import { Module } from '@nestjs/common';
import { CentersController } from './centers/centers.controller';
import { CentersService } from './centers/centers.service';
import { PrismaModule } from '../prisma/prisma.module';
//import { InternalCentersHttpController } from './internal-http.controller';

@Module({
  controllers: [CentersController /*, InternalCentersHttpController*/],
  providers: [CentersService],
  imports: [PrismaModule],
})
export class AppModule {}
