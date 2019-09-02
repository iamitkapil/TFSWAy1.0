using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using TFSWay.DomainModel.Entities;
using TFSWay.BL.Model;

namespace TFSWay.BL.Abstract
{
    public interface IQuery
    {
        IEnumerable<Query> GetQueries();
        IEnumerable<Reply> GetReplies(int queryId);
        IEnumerable<QueryReplyModel> GeQueryData(int projectid);
        IEnumerable<QueryReplyModel> GeQueryExporttoExcelData(int projectid, string queryIds);
        string GeQueryMailBody(string queryIds);
        QueryReplyModel GeQueryDataById(int queryId);
        Task<String> AddQuery(QueryReplyModel query);
        Task<String> AddReply(Reply reply);
        Task<String> UpdateQuery(QueryReplyModel query);
        Task<String> UpdateReply(Reply reply);
        String DeleteQuery(int id);
        String DeleteReply(int id);
    }

}
