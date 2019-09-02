using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using TFSWay.DomainModel.Entities;

namespace TFSWay.DomainModel.Abstract
{
    public interface ITeaserRepository
    {
        IEnumerable<Teaser> Teasers { get; }
        IEnumerable<Teaser> GetTeasers();
        Task<int> AddTeaser(Teaser teaser);
        Task<int> UpdateTeaser(Teaser teaser);
        Task<int> DeleteTeaser(int id);
    }
}
