import { NestFactory } from '@nestjs/core';
import { Transport } from '@nestjs/microservices';
import { AppModule } from './app.module';
import rabbitMqLink from './links';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.connectMicroservice({
    transport: Transport.RMQ,
    options: {
      urls: [rabbitMqLink],
      queue: 'gitlab-auth',
      queueOptions: {
        durable: false,
        noAck: false,
      },
    },
  });

  await app.startAllMicroservicesAsync();
  await app.listen(3020);
}
bootstrap();
