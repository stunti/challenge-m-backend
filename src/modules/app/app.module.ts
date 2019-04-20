import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from '../../services/app.service';
import { WebsiteModule } from '../website/website.module';

@Module({
  imports: [WebsiteModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
