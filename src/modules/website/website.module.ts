import { Module } from "@nestjs/common";
import { WebsiteController } from "./website.controller";
import { WebsiteService } from "../../services/website/website.service";
import { FirebaseService } from "services/firebase/firebase.service";

@Module({
  controllers: [WebsiteController],
  providers: [
		WebsiteService, 
		FirebaseService
	]
})
export class WebsiteModule {}
