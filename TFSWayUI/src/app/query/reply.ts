export interface IReply {

    replyId: number;
    QueryId: number;
    QueryText: string;
    QueryDate: Date;
    ReplyText: string;
    ReplyDate: Date;
    CreatedDate: Date;
    CreatedBy: string;


    replies: Array<IReply>;

}

