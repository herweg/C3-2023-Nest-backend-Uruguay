import dotenv from "dotenv"
dotenv.config()

// Libraries
import { NestFactory } from '@nestjs/core';


// Main module
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  await app.listen(3000);
}
bootstrap();
