export interface IProjectActivityPlan {
    projectActivityPlanID: number;
    projectPlanID: number;
    projectID: number;
    TemplateID: string;
    parentID: number;
    srNo: string;
    activity: string;
    task: string;
    dependency: string;
    startDate: Date;
    endDate: Date;
    delay: number;
    complitionDate: Date;
    status: string;
    createdDate: Date;
    createdBy: string;


    projectplans: Array<IProjectActivityPlan>;

}

