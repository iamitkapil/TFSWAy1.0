using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using TFSWay.DomainModel.Entities;

namespace TFSWay.DomainModel.Abstract
{
    public interface IMOMRepository
    {

        IEnumerable<MOM> MOMs { get; }
        IEnumerable<MOM> GetMOMs();
        Task<int> AddMOM(MOM mom);
        Task<int> DeleteMOM(int momid);
        Task<int> UpdateMOM(MOM mom);

    }
}