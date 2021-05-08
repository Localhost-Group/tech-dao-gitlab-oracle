export interface IUserFromGitlab {
  id: string;
  email: string;
}

export interface IContributorData {
  id: string;
  login: string;
}
export interface IProjectLanguages {
  nameOfLanguage: string;
  percentegeValue: number;
}

export interface IProjectData {
  projectId: string;
  star_count: number;
  forks_count: number;
  projectMembers: Array<IContributorData>;
  userIsOwner: boolean;
  projectLanguages: Array<IProjectLanguages>;
}

export interface IDataForCalculateTokens {
  user: IUserFromGitlab;
  projectsData: Array<IProjectData>;
}
