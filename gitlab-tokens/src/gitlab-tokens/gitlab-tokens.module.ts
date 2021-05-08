import { HttpModule, Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import rabbitMqLink from 'src/links';
import { GitlabTokensController } from './gitlab-tokens.controller';
import { GitlabService } from './services/gitlab.service';
import { ProjectsService } from './services/projects.service';
import { UserService } from './services/user.service';

@Module({
  imports: [
    HttpModule,
    ClientsModule.register([
      {
        name: 'Tokens_Service',
        transport: Transport.RMQ,
        options: {
          urls: [rabbitMqLink],
          queue: 'gitlab-auth',
        },
      },
    ]),
  ],
  controllers: [GitlabTokensController],
  providers: [GitlabService, UserService, ProjectsService],
})
export class GitlabTokensModule {}
