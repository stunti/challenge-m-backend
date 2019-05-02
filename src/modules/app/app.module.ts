import { Module } from "@nestjs/common";
import { AppController } from "./app.controller";
import { AppService } from "modules/app/service/app/app.service";
import { WebsiteModule } from "modules/website/website.module";
import { AuthModule } from "modules/auth/auth.module";
import { UserModule } from "modules/user/user.module";

@Module({
  imports: [WebsiteModule, AuthModule, UserModule],
  controllers: [AppController],
  providers: [AppService]
})
export class AppModule {}
