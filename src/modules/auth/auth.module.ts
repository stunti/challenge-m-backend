import {
    Module,
    NestModule,
    MiddlewareConsumer,
    RequestMethod,
  } from '@nestjs/common';
  
  
import { AuthController } from './auth.controller';

// Strategies
import { JwtStrategy } from './passport/jwt.strategy';
  

// import { UserModule } from 'modules/user/user.module';
import { AuthService } from 'modules/auth/service/auth/auth.service';
import { UserModule } from 'modules/user/user.module';
import { WebsiteModule } from 'modules/website/website.module';
import { LocalStrategy } from './passport/local.strategy';
  
  @Module({
    imports: [UserModule, WebsiteModule],
    controllers: [AuthController],
    providers: [AuthService, JwtStrategy, LocalStrategy],
    exports: [AuthService, JwtStrategy, LocalStrategy],
  })
  export class AuthModule {}
