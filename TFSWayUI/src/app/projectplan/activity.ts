export interface Iactivity {

    ActivityID: number;
    TemplateID: string;
    Activity: string;
    OtherActivity: string;
    ParentID: number;
    Dependency: string;
    Description: string;
    CreatedDate: Date;
    CreatedBy: string;

    activities: Array<Iactivity>;

}

