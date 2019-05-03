import {Module} from '@nestjs/common';
import { UserModule } from '../user/user.module';
import { WebsiteModule } from '../website/website.module';
import { AuthController } from './auth.controller';
import { AuthService } from './service/auth/auth.service';
import { JwtStrategy } from './passport/jwt.strategy';
import { LocalStrategy } from './passport/local.strategy';
  

  
  @Module({
    imports: [UserModule, WebsiteModule],
    controllers: [AuthController],
    providers: [AuthService, JwtStrategy, LocalStrategy],
    exports: [AuthService, JwtStrategy, LocalStrategy],
  })
  export class AuthModule {}
