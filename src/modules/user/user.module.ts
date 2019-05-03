import { Module } from '@nestjs/common';

import { UserController } from './user.controller';
import { UserService } from './service/user/user.service';
import { WebsiteModule } from '../website/website.module';


@Module({
    imports: [WebsiteModule],
    controllers: [UserController],
    providers: [UserService],
    exports: [UserService],
})
export class UserModule {}