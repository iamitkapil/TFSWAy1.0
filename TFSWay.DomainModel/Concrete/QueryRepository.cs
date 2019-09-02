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
    public class QueryRepository : IQueryRepository
    {

        private TFSWayDBContext db;
        public QueryRepository()
        {
            db = new Concrete.TFSWayDBContext();
        }

        public IEnumerable<Query> Queries
        {
            get { return db.Queries; }
        }

        public IEnumerable<Query> GetQueries()
        {
            return this.Queries;

        }

        public async Task<Query> FetchbyQueryId(int queryid)
        {
            Query query = await db.Queries.FindAsync(queryid);
            return query;
        }

        public async Task<int> AddQuery(Query query)
        {
            db.Queries.Add(query);
            await db.SaveChangesAsync();
            int insertedqueryid = query.QueryId;
            return insertedqueryid;
        }

        public async Task<int> UpdateQuery(Query query)
        {
            Query existingquery = await FetchbyQueryId(query.QueryId);
            db.Entry(existingquery).State = EntityState.Detached;
            db.Entry(query).State = EntityState.Modified;
            int result = await db.SaveChangesAsync();
            return result;
        }

        public async Task<int> DeleteQuery(int queryid)
        {
            Query query = await FetchbyQueryId(queryid);
            db.Queries.Remove(query);
            int result = await db.SaveChangesAsync();
            return result;
        }

    }
}

