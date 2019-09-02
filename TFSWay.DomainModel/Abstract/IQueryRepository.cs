using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using TFSWay.DomainModel.Entities;

namespace TFSWay.DomainModel.Abstract
{
    public interface IQueryRepository
    {

        IEnumerable<Query> Queries { get; }
        IEnumerable<Query> GetQueries();
        Task<int> AddQuery(Query query);
        Task<int> UpdateQuery(Query query);
        Task<int> DeleteQuery(int id);
 
    }
}