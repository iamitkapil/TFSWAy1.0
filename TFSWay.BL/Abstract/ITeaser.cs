using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using TFSWay.DomainModel.Entities;
using TFSWay.BL.Model;

namespace TFSWay.BL.Abstract
{
    public interface ITeaser
    {
        ProjectTeaserModel GetTeaser(int projectid);
        Task<string> AddTeaser(Teaser teaser);
        IEnumerable<Teaser> GetTeasers(int projectid);
        Task<string> UpdateTeaser(Teaser teaser);
        ProjectTeaserModel GetNewTeaser(int projectid);
    }
}
