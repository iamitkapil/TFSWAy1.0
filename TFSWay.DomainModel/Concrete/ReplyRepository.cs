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
    public class ReplyRepository : IReplyRepository
    {

        private TFSWayDBContext db;
        public ReplyRepository()
        {
            db = new Concrete.TFSWayDBContext();
        }

        public IEnumerable<Reply> Replies
        {
            get { return db.Replies; }
        }

        public IEnumerable<Reply> GetReplies()
        {
            return this.Replies;

        }

        public async Task<Reply> FetchbyReplyId(int replyid)
        {
            Reply reply = await db.Replies.FindAsync(replyid);
            return reply;
        }

        public async Task<int> AddReply(Reply reply)
        {
            db.Replies.Add(reply);
            int result = await db.SaveChangesAsync();
            return result;
        }

        public async Task<int> UpdateReply(Reply reply)
        {
            Reply existingreply = await FetchbyReplyId(reply.ReplyId);
            db.Entry(existingreply).State = EntityState.Detached;
            db.Entry(reply).State = EntityState.Modified;
            int result = await db.SaveChangesAsync();
            return result;
        }

        public async Task<int> DeleteReply(int replyid)
        {
            Reply reply = await FetchbyReplyId(replyid);
            db.Replies.Remove(reply);
            int result = await db.SaveChangesAsync();
            return result;
        }
        public async Task<int> DeleteReplybyQueryId(int queryid)
        {
            Reply reply = await FetchbyReplyId(queryid);
            db.Replies.Remove(reply);
            int result = await db.SaveChangesAsync();
            return result;
        }
        

    }
}

