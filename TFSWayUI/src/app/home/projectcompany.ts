import{ IProject } from '../project/project'

export interface IProjectCompany{

    project: IProject;
    group: IGroup
    company: ICompany;
    projectManager: IUser;
    supervisor: IUser;
  }

export interface IGroup
{
    groupId: number;
    groupName: string;
}

export interface ICompany
{
    companyId: number;
    companyName: string;
}

export interface IUser
{
    userID: number;
    firstName: string;
    lastName: string;
}