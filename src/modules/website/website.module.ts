import { Module, HttpModule } from "@nestjs/common";
import { WebsiteController } from "./website.controller";
import { WebsiteService } from "./service/website/website.service";
import { BlockingService } from "./service/blocking/blocking.service";
import { FirebaseService } from "./service/firebase/firebase.service";

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
