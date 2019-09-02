using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using TFSWay.DomainModel.Entities;
using TFSWay.BL.Model;

namespace TFSWay.BL.Abstract
{
    public interface IMOM
    {
        IEnumerable<MOM> GetMOMs();
        IEnumerable<MOM> GetMOMs(int projectid);
        IEnumerable<MOM> GetMOMTasks(int projectid);
        string GeMOMMailBody(string momIds);
        Task<int> AddMOM(MOM mom);
        String DeleteMOM(int momid);
        Task<String> UpdateMOM(MOM mom);

    }
}