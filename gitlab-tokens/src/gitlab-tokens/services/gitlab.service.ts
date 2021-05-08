import { Injectable } from '@nestjs/common';
import { IDataForCalculateTokens } from 'src/types';

import { ProjectsService } from './projects.service';
import { UserService } from './user.service';

@Injectable()
export class GitlabService {
  constructor(
    private readonly userService: UserService,
    private readonly projectsService: ProjectsService,
  ) {}
  public async handleCollectingData(
    accessToken: string,
  ): Promise<IDataForCalculateTokens> {
    try {
      const user = await this.userService.collectDataAboutUser(accessToken);
      console.log(user);
      const projectsData = await this.projectsService.getUserProjects(
        accessToken,
        user.id,
      );

      return { user, projectsData };
    } catch (err) {
      console.log(err);
    }
  }
}
