export interface IDocument {

    documentID: number;
    ProjectID: number;
    GroupID: number;
    documentName: string;
    FilePath: string;
    DocumnetType: string;
    Stage: string;
    Completed: string;
    CreatedDate: Date;
    CreatedBy: string;


    documents: Array<IDocument>;

}

export interface IDocumentMaster {

    documentMasterId: number;
    stage: string;
    document: string;
    }