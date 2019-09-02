using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using TFSWay.DomainModel.Entities;

namespace TFSWay.BL.Abstract
{
    public interface IClientDetail
    {
        
        IEnumerable<ClientDetail> GetClientDetails();
        ClientDetail GetClientDetailbyProjectId(int projectId);
        Task<string> UpdateClientDetail(ClientDetail client);
    }
}
