using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using TFSWay.DomainModel.Entities;

namespace TFSWay.DomainModel.Abstract
{
    public interface IReplyRepository
    {

        IEnumerable<Reply> Replies { get; }
        IEnumerable<Reply> GetReplies();
        Task<int> AddReply(Reply reply);
        Task<int> UpdateReply(Reply reply);
        Task<int> DeleteReply(int id);
        Task<int> DeleteReplybyQueryId(int id);

    }
}