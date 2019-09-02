using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using TFSWay.BL.Abstract;
using TFSWay.DomainModel.Entities;
using TFSWay.DomainModel.Abstract;
using TFSWay.BL.Model;
using TFSWay.BL.Extensions;

namespace TFSWay.BL.Concrete
{
    public class ClsQuery : IQuery
    {
        private IQueryRepository QueryRepository;
        private IReplyRepository ReplyRepository;
        private IDocumentRepository DocumentRepository;
        public ClsQuery(IQueryRepository queryRepository, IReplyRepository replyRepository, IDocumentRepository documentrepository)
        {
            this.QueryRepository = queryRepository;
            this.ReplyRepository = replyRepository;
            this.DocumentRepository = documentrepository;
        }


        public IEnumerable<Query> GetQueries()
        {
            var queries = QueryRepository.GetQueries();
            return queries;
        }

        public IEnumerable<Reply> GetReplies()
        {
            var replies = ReplyRepository.GetReplies().OrderByDescending(c => c.ReplyId);
            return replies;
        }
        public IEnumerable<Reply> GetReplies(int queryId)
        {
            IEnumerable<Reply> replylist = new List<Reply>();
            replylist = GetReplies().Where(c => c.QueryId == queryId);
            return replylist;
        }

        public IEnumerable<QueryReplyModel> GeQueryData(int projectid)
        {
            List<QueryReplyModel> queryreplylist = new List<QueryReplyModel>();

            IEnumerable<Query> querylist = new List<Query>();

            querylist = GetQueries().Where(c => c.ProjectID == projectid);


            foreach (Query query in querylist)
            {
                List<int> DocumentIDList = new List<int>();
                if (query.RefDocument != "")
                    DocumentIDList = query.RefDocument.Split(',').Select(int.Parse).ToList();

                var reply = ReplyRepository.GetReplies().OrderByDescending(c => c.ReplyId).First(c => c.QueryId == query.QueryId);
                List<DocumentRefModel> documentreflist = new List<DocumentRefModel>();


                foreach (int docid in DocumentIDList)
                {
                    var documents = DocumentRepository.GetDocumentByID(docid);
                    if (documents.FilePath != "")
                        documentreflist.Add(new DocumentRefModel
                        {
                            DocumentID = documents.DocumentID,
                            DocumnetName = documents.DocumentName,
                            DocumnetPath = documents.FilePath
                        });
                }

                queryreplylist.Add(new QueryReplyModel
                {
                    QueryId = query.QueryId,
                    ProjectID = query.ProjectID,
                    Subject = query.Subject,
                    QueryText = reply.QueryText,
                    QueryDate = reply.QueryDate,
                    Replytext = reply.ReplyText,
                    ReplyDate = reply.ReplyDate,
                    AssignTo = query.AssignTo,
                    AssignToMailID = query.AssignToMailID,
                    Querytype = query.Querytype,
                    Severity = query.Severity,
                    Status = query.Status,
                    RefDocument = query.RefDocument,
                    DocumnetRefList = documentreflist,
                    CreatedDate = query.CreatedDate.Value,
                    CreatedBy = query.CreatedBy
                });


            }
            return queryreplylist;
        }

        public IEnumerable<QueryReplyModel> GeQueryExporttoExcelData(int projectid, string queryIds)
        {
            List<QueryReplyModel> queryreplylist = new List<QueryReplyModel>();

            IEnumerable<Query> querylist = new List<Query>();

            querylist = GetQueries().Where(c => c.ProjectID == projectid);
            if (queryIds == "All")
            {
                foreach (Query query in querylist)
                {
                    List<int> DocumentIDList = new List<int>();
                    if (query.RefDocument != "")
                        DocumentIDList = query.RefDocument.Split(',').Select(int.Parse).ToList();

                    List<Reply> replylist = GetReplies(query.QueryId).ToList();
                    var strQuery = "";
                    var strReply = "";
                    var strDocuments = "";
                    foreach (Reply reply in replylist)
                    {

                        //strQuery = "<b>Query (" + Convert.ToDateTime(reply.QueryDate).ToString("dd/MMM/yyyy h:mm yy tt") + ") - </b>: " + reply.QueryText;
                        //strReply = "<b>Reply (" + Convert.ToDateTime(reply.ReplyDate).ToString("dd/MMM/yyyy h:mm yy tt") + ") - </b>: " + reply.ReplyText + "<br/>";
                        strQuery = "Query - " + reply.QueryText;
                        strReply = "Reply - " + reply.ReplyText + "<br/>";

                    }
                    //strQuery = "<table>" + strQuery + "</table>";
                    strReply = "<table width='100%' class='Innertable'>" + strReply + "</table>";

                    List<DocumentRefModel> documentreflist = new List<DocumentRefModel>();


                    foreach (int docid in DocumentIDList)
                    {
                        var documents = DocumentRepository.GetDocumentByID(docid);

                        if (strDocuments == "")
                        {
                            strDocuments = documents.DocumentName;
                        }
                        else
                        {
                            strDocuments = strDocuments + "," + documents.DocumentName;
                        }

                    }

                    queryreplylist.Add(new QueryReplyModel
                    {
                        QueryId = query.QueryId,
                        ProjectID = query.ProjectID,
                        Subject = query.Subject,
                        QueryText = strQuery,
                        Replytext = strReply,
                        AssignTo = query.AssignTo,
                        AssignToMailID = query.AssignToMailID,
                        Querytype = query.Querytype,
                        Severity = query.Severity,
                        Status = query.Status,
                        RefDocument = strDocuments,
                        CreatedDate = query.CreatedDate.Value,
                        CreatedBy = query.CreatedBy
                    });


                }
            }
            else
            {
                foreach (Query query in querylist)
                {
                    if (queryIds.Contains(query.QueryId.ToString()))
                    {
                        List<int> DocumentIDList = new List<int>();
                        if (query.RefDocument != "")
                            DocumentIDList = query.RefDocument.Split(',').Select(int.Parse).ToList();

                        List<Reply> replylist = GetReplies(query.QueryId).ToList();
                        var strQuery = "";
                        var strReply = "";
                        var strDocuments = "";
                        foreach (Reply reply in replylist)
                        {

                            //strQuery = "<b>Query (" + Convert.ToDateTime(reply.QueryDate).ToString("dd/MMM/yyyy h:mm yy tt") + ") - </b>: " + reply.QueryText;
                            //strReply = "<b>Reply (" + Convert.ToDateTime(reply.ReplyDate).ToString("dd/MMM/yyyy h:mm yy tt") + ") - </b>: " + reply.ReplyText + "<br/>";
                            strQuery = "Query - " + reply.QueryText;
                            strReply = "Reply - " + reply.ReplyText + "<br/>";

                        }

                        List<DocumentRefModel> documentreflist = new List<DocumentRefModel>();


                        foreach (int docid in DocumentIDList)
                        {
                            var documents = DocumentRepository.GetDocumentByID(docid);

                            if (strDocuments == "")
                            {
                                strDocuments = documents.DocumentName;
                            }
                            else
                            {
                                strDocuments = strDocuments + "," + documents.DocumentName;
                            }

                        }

                        queryreplylist.Add(new QueryReplyModel
                        {
                            QueryId = query.QueryId,
                            ProjectID = query.ProjectID,
                            Subject = query.Subject,
                            QueryText = strQuery,
                            Replytext = strReply,
                            AssignTo = query.AssignTo,
                            AssignToMailID = query.AssignToMailID,
                            Querytype = query.Querytype,
                            Severity = query.Severity,
                            Status = query.Status,
                            RefDocument = strDocuments,
                            CreatedDate = query.CreatedDate.Value,
                            CreatedBy = query.CreatedBy
                        });


                    }
                }
            }

            return queryreplylist;
        }

        public string GeQueryMailBody(string queryIds)
        {
            string QueryMailBody = "";
            string mailBody = "<br/><br/>Please find attached the list of queries which are required to be clarified. Please share your reply as earliest.<br/><br/>";
            List<int> intquerylist = queryIds.Split(',').Select(int.Parse).ToList();

            IEnumerable<Query> querylist = new List<Query>();
            querylist = GetQueries().Where(c => intquerylist.Contains(c.QueryId));

            string strrow = "";
            int i = 1;
            string strHeader = " <table class='table table-bordered' border='1' bordercolor='black' width='100%'><tr><td> Sr. No.</td><td>Query</td><td>Reply</td></tr>";
            foreach (Query query in querylist)
            {
                List<Reply> replylist = GetReplies(query.QueryId).ToList();
                var strQuery = "";
                var strReply = "";

                foreach (Reply reply in replylist)
                {

                    strQuery = Convert.ToDateTime(reply.QueryDate).ToShortDateString() + "</b>: " + reply.QueryText;
                    strReply = Convert.ToDateTime(reply.ReplyDate).ToShortDateString() + "</b>: " + reply.ReplyText + "<br/>";

                }

                strrow = strrow + "<tr><td>" + i + "</td><td>" + strQuery + "</td><td>" + strReply + "</td></tr>";
                i++;
            }
            QueryMailBody = mailBody + strHeader + strrow + "</table>";

            return QueryMailBody;
        }
        public QueryReplyModel GeQueryDataById(int queryId)
        {

            QueryReplyModel returnobj = new QueryReplyModel();

            Query query = QueryRepository.GetQueries().FirstOrDefault(c => c.QueryId == queryId);
            Reply reply = ReplyRepository.GetReplies().OrderByDescending(c => c.ReplyId).First(c => c.QueryId == query.QueryId);

            List<int> DocumentIDList = new List<int>();
            if (query.RefDocument != "")
                DocumentIDList = query.RefDocument.Split(',').Select(int.Parse).ToList();

            List<DocumentRefModel> documentreflist = new List<DocumentRefModel>();


            foreach (int docid in DocumentIDList)
            {
                var documents = DocumentRepository.GetDocumentByID(docid);
                if (documents.FilePath != "")
                    documentreflist.Add(new DocumentRefModel
                    {
                        DocumentID = documents.DocumentID,
                        DocumnetName = documents.DocumentName,
                        DocumnetPath = documents.FilePath
                    });
            }

            returnobj = new QueryReplyModel
            {
                QueryId = query.QueryId,
                ProjectID = query.ProjectID,
                Subject = query.Subject,
                QueryText = reply.QueryText,
                QueryDate = reply.QueryDate,
                Replytext = reply.ReplyText,
                ReplyDate = reply.ReplyDate,
                AssignTo = query.AssignTo,
                AssignToMailID = query.AssignToMailID,
                Querytype = query.Querytype,
                Severity = query.Severity,
                Status = query.Status,
                RefDocument = query.RefDocument,
                DocumnetRefList = documentreflist,
                CreatedDate = query.CreatedDate.Value,
                CreatedBy = query.CreatedBy
            };

            return returnobj;
        }

        public async Task<string> AddQuery(QueryReplyModel query)
        {
            DateTime now = DateTime.Now;
            if (query.RefDocument.Contains("NaN,"))
                query.RefDocument = query.RefDocument.Replace("NaN,", "");


            int insertedqueryid = await QueryRepository.AddQuery(new Query { ProjectID = query.ProjectID, Subject = query.QueryText, AssignTo = query.AssignTo, AssignToMailID = query.AssignToMailID, Querytype = query.Querytype, Severity = query.Severity, Status = query.Status, RefDocument = query.RefDocument, CreatedDate = query.CreatedDate, CreatedBy = query.CreatedBy });
            int insertedrelyid = await ReplyRepository.AddReply(new Reply { QueryId = insertedqueryid, QueryText = query.QueryText, ReplyText = query.Replytext, QueryDate = now, ReplyDate = now, CreatedDate = query.CreatedDate, CreatedBy = query.CreatedBy });
            return insertedqueryid != 0 ? "Successfully Insertion of query record" : "Insertion failed";

        }

        public async Task<string> UpdateQuery(QueryReplyModel queryreply)
        {

            Query query = QueryRepository.GetQueries().FirstOrDefault(c => c.QueryId == queryreply.QueryId);

            if (query == default(Query))
                return "query doen't exist";
            else
            {
                query.AssignTo = queryreply.AssignTo;
                query.AssignToMailID = queryreply.AssignToMailID;
                query.Querytype = queryreply.Querytype;
                query.Severity = queryreply.Severity;
                query.Status = queryreply.Status;
                if (queryreply.RefDocument.Contains("NaN,"))
                    query.RefDocument = queryreply.RefDocument.Replace("NaN,", "");
                else
                    query.RefDocument = queryreply.RefDocument;

            }

            int updatequery = await QueryRepository.UpdateQuery(query);

            return updatequery == 0 ? "Successfully updated query and reply record" : "Updation failed";

        }

        public async Task<string> UpdateReply(Reply rep)
        {
            DateTime? ReplyDate = DateTime.Now;
            Reply reply = ReplyRepository.GetReplies().SingleOrDefault(c => c.ReplyId == rep.ReplyId);

            if (reply == default(Reply))
                return "Reply doen't exist";
            else
            {
                reply.ReplyText = rep.ReplyText;
                reply.ReplyDate = ReplyDate.Value;

            }

            int updatereply = await ReplyRepository.UpdateReply(reply);

            return updatereply == 0 ? "Successfully updated query and reply record" : "Updation failed";

        }

        public async Task<string> AddReply(Reply reply)
        {
            DateTime QueryDate = DateTime.Now;
            DateTime? ReplyDate = DateTime.Now;
            if (reply.ReplyText == "")
                ReplyDate = null;
            int insertedrelyid = await ReplyRepository.AddReply(new Reply { QueryId = reply.QueryId, QueryText = reply.QueryText, QueryDate = QueryDate, ReplyText = reply.ReplyText, ReplyDate = ReplyDate, CreatedDate = reply.CreatedDate, CreatedBy = reply.CreatedBy });
            return insertedrelyid != 0 ? "Successfully Insertion of reply record" : "Insertion failed";
        }

        public string DeleteQuery(int queryid)
        {
            Reply reply = ReplyRepository.GetReplies().OrderByDescending(c => c.ReplyId).First(c => c.QueryId == queryid);

            int deletereply = Task.Run<int>(async () => await ReplyRepository.DeleteReply(reply.ReplyId)).Result;
            int deletequery = Task.Run<int>(async () => await QueryRepository.DeleteQuery(queryid)).Result;
            return deletequery > 0 && deletereply > 0 ? "Successfully Deleted query and reply record" : "Deletion failed";
        }

        public string DeleteReply(int replyid)
        {
            Reply reply = ReplyRepository.GetReplies().SingleOrDefault(c => c.ReplyId == replyid);

            int deletereply = Task.Run<int>(async () => await ReplyRepository.DeleteReply(reply.ReplyId)).Result;
            return deletereply > 0 ? "Successfully Deleted reply and client record" : "Deletion failed";
        }
    }
}
