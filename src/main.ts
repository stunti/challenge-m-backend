import { NestFactory } from "@nestjs/core";
import { AppModule } from "./modules/app/app.module";
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import cors from 'cors';

async function bootstrap() {
	const app = await NestFactory.create(AppModule);
	app.use(cors());

	const options = new DocumentBuilder()
	.setTitle('Website M challenge')
	.setDescription('API used for the M challenge description')
	.setVersion('1.0')
	.build();
const document = SwaggerModule.createDocument(app, options);
SwaggerModule.setup('api', app, document);

  await app.listen(3000);
}
bootstrap();
