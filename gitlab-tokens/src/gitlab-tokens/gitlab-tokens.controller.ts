import { Controller } from '@nestjs/common';
import { EventPattern } from '@nestjs/microservices';
import { GitlabService } from './services/gitlab.service';

@Controller('gitlab-tokens')
export class GitlabTokensController {
  constructor(private readonly gitlabService: GitlabService) {}

  @EventPattern('gitlab_token')
  async handleCollectingData(data: any): Promise<void> {
    const {
      user,
      projectsData,
    } = await this.gitlabService.handleCollectingData(data);
    console.log(user);
    projectsData.forEach((el) => console.log(el));
  }
}
