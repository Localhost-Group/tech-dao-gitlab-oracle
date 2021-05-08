import { HttpService, Injectable } from '@nestjs/common';
import { map } from 'rxjs/operators';
import { IUserFromGitlab } from 'src/types';

@Injectable()
export class UserService {
  private gitlabApiUrl: string = `https://gitlab.com/api/v4/user`;
  constructor(private httpService: HttpService) {}
  public async collectDataAboutUser(
    authToken: string,
  ): Promise<IUserFromGitlab> {
    const { email, id } = await this.httpService
      .get(this.gitlabApiUrl, {
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      })
      .pipe(map((result) => result.data))
      .toPromise();
    return { email, id };
  }
}
