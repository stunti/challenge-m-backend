import { Module } from "@nestjs/common";

import { AppController } from "./app.controller";
import { AuthModule } from "../auth/auth.module";
import { UserModule } from "../user/user.module";
import { WebsiteModule } from "../website/website.module";
import { AppService } from "./service/app/app.service";

@Module({
  imports: [WebsiteModule, AuthModule, UserModule],
  controllers: [AppController],
  providers: [AppService]
})
export class AppModule {}
