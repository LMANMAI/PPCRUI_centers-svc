import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CentersModule } from './centers/centers.module';

@Module({
  imports: [CentersModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
