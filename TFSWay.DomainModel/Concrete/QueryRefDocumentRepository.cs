using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using TFSWay.DomainModel.Abstract;
using TFSWay.DomainModel.Entities;
using System.Data.Entity;

namespace TFSWay.DomainModel.Concrete
{
    public class QueryRefDocumentRepository : IQueryRefDocumentRepository
    {

        private TFSWayDBContext db;
        public QueryRefDocumentRepository()
        {
            db = new Concrete.TFSWayDBContext();
        }

        public IEnumerable<QueryRefDocument> QueryRefDocuments
        {
            get { return db.QueryRefDocuments; }
        }

        public IEnumerable<QueryRefDocument> GetQueryRefDocuments()
        {
            return this.QueryRefDocuments;

        }

        public List<QueryRefDocument> GetQueryRefDocumentList()
        {
            return this.QueryRefDocuments.ToList();

        }

        public async Task<QueryRefDocument> FetchbyQueryRefDocumentId(int queryrefdocumentid)
        {
            QueryRefDocument queryrefdocuments = await db.QueryRefDocuments.FindAsync(queryrefdocumentid);
            return queryrefdocuments;
        }

        public async Task<int> AddQueryRefDocument(QueryRefDocument queryrefdocument)
        {
            db.QueryRefDocuments.Add(queryrefdocument);
            int result = await db.SaveChangesAsync();
            return result;
        }

        public async Task<int> UpdateQueryRefDocument(QueryRefDocument queryrefdocument)
        {
            QueryRefDocument existingqueryrefdocument = await FetchbyQueryRefDocumentId(queryrefdocument.QueryRefDocumentID);
            db.Entry(existingqueryrefdocument).State = EntityState.Detached;
            db.Entry(queryrefdocument).State = EntityState.Modified;
            int result = await db.SaveChangesAsync();
            return result;
        }

        //public async Task<int> DeleteQueryRefDocumenty(int QueryRefDocumentID)
        //{
        //    Reply reply = await FetchbyReplyId(replyid);
        //    db.Replies.Remove(reply);
        //    int result = await db.SaveChangesAsync();
        //    return result;
        //}
        //public async Task<int> DeleteReplybyQueryId(int queryid)
        //{
        //    Reply reply = await FetchbyReplyId(queryid);
        //    db.Replies.Remove(reply);
        //    int result = await db.SaveChangesAsync();
        //    return result;
        //}
        

    }
}

