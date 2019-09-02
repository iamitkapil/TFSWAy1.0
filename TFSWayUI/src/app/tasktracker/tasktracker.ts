export interface ITaskTracker {

    TaskTrackerID: number;
    ProjectID: number;
    Task: string;
    Responsible: string;
    PlanDate: Date;
    Status: string;
    CreatedDate: Date;
    CreatedBy: string;


    tasktrackers: Array<ITaskTracker>;

}

