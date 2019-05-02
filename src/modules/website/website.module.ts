import { Module, HttpModule } from "@nestjs/common";
import { WebsiteController } from "./website.controller";
import { WebsiteService } from "./service/website/website.service";
import { FirebaseService } from "modules/website/service/firebase/firebase.service";
import { BlockingService } from "./service/blocking/blocking.service";

@Module({
	controllers: [WebsiteController],
	providers: [
		WebsiteService, 
		FirebaseService,
		BlockingService,
	],
	exports: [
		WebsiteService, 
		FirebaseService,
		BlockingService,
	],
	imports: [
		HttpModule,
	]
})
export class WebsiteModule {}
