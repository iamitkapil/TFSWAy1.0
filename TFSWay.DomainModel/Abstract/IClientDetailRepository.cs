using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using TFSWay.DomainModel.Entities;

namespace TFSWay.DomainModel.Abstract
{
    public interface IClientDetailRepository
    {

        IEnumerable<ClientDetail> ClientDetails { get; }
        IEnumerable<ClientDetail> GetClientDetails();
        Task<int> AddClientDetail(ClientDetail clientdetail);
        Task<int> UpdateClientDetail(ClientDetail clientdetail);
        Task<int> DeleteClientDetail(int id);
    }
}
