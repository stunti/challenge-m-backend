import { NestFactory } from "@nestjs/core";
import { AppModule } from "./modules/app/app.module";
import cors from 'cors';

async function bootstrap() {
	const app = await NestFactory.create(AppModule);
	app.use(cors());

  await app.listen(3000);
}
bootstrap();
