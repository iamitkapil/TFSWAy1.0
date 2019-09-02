using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using TFSWay.DomainModel.Entities;
using TFSWay.BL.Model;


namespace TFSWay.BL.Abstract
{
    public interface IDirector
    {
        IEnumerable<DirectorListModel> GetAllDirectors(int companyId);
        IEnumerable<DirectorListModel> GetDirectorsLookupList();
        Task<string> AddDirector(Director director);
        Director GetDirector(int directorid);
        Task<string> UpdateDirector(Director director);
        String DeleteDirector(int directorid);

    }

    public enum DirectorType { Company, Promoter };
}
