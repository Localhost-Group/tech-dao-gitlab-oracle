import { Module } from '@nestjs/common';
import { GitlabTokensModule } from './gitlab-tokens/gitlab-tokens.module';

@Module({
  imports: [GitlabTokensModule],
})
export class AppModule {}
