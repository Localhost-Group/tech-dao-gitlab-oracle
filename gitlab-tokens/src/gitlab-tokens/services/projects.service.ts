import { HttpService, Injectable } from '@nestjs/common';
import { map } from 'rxjs/operators';
import { IProjectData, IContributorData, IProjectLanguages } from 'src/types';

@Injectable()
export class ProjectsService {
  constructor(private httpService: HttpService) {}
  public getUserProjects(
    accessToken: string,
    userId: string,
  ): Promise<IProjectData[]> {
    return this.getProjects(accessToken, userId).then((projects) => {
      return this.prepareDataAboutProjects(projects, accessToken, userId);
    });
  }

  private getProjects(
    accessToken: string,
    userId: string,
  ): Promise<Array<any>> {
    const urlToRequest = `https://gitlab.com/api/v4/users/${userId}/projects`;
    return this.httpService
      .get(urlToRequest, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      })
      .pipe(map((result) => result.data))
      .toPromise()
      .then((projects) => {
        return projects.filter((project) => project.visibility !== 'private');
      });
  }
  private requestProjectMembers(
    membersLink: string,
    accessToken: string,
  ): Promise<Array<IContributorData>> {
    return this.httpService
      .get(membersLink, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      })
      .pipe(map((result) => result.data))
      .toPromise()
      .then((projectMembers) => {
        return projectMembers.map((el) => {
          const { id, username } = el;
          return { id, login: username };
        });
      });
  }
  private requestProjectLanguages(
    accessToken: string,
    projectId: string,
  ): Promise<Array<IProjectLanguages>> {
    const urlToRequest = `https://gitlab.com/api/v4/projects/${projectId}/languages`;
    return this.httpService
      .get(urlToRequest, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      })
      .pipe(map((result) => result.data))
      .toPromise()
      .then((projectLanguagesData) => {
        return Object.entries(projectLanguagesData).map(
          (entry: [string, number]) => {
            return { nameOfLanguage: entry[0], percentegeValue: entry[1] };
          },
        );
      });
  }

  private async prepareDataAboutProjects(
    projects: Array<any>,
    accessToken: string,
    userId: string,
  ) {
    const arrToAddDataAboutProjects: Array<IProjectData> = [];
    for (const project of projects) {
      const { id, star_count, forks_count, _links, owner } = project;
      const { members } = _links;

      const projectMembers = await this.requestProjectMembers(
        members,
        accessToken,
      );
      const projectLanguages: Array<IProjectLanguages> = await this.requestProjectLanguages(
        accessToken,
        id,
      );
      const userIsOwner = owner.id === userId ? true : false;
      arrToAddDataAboutProjects.push({
        projectId: id,
        star_count,
        forks_count,
        userIsOwner,
        projectMembers,
        projectLanguages,
      });
    }
    return arrToAddDataAboutProjects;
  }
}
