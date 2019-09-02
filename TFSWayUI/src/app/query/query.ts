export interface IQuery {

    queryId: number;
    ProjectID: number;
    QueryText: string;
    ReplyText: string;
    AssignTo: string;
    assignToMailID: string;
    Documnets: string;
    DocumnetPath: string;
    RefDocument: string;
    CreatedDate: Date;
    CreatedBy: string;


    queries: Array<IQuery>;

}

