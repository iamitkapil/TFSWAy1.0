using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using TFSWay.DomainModel.Entities;

namespace TFSWay.DomainModel.Abstract
{
    public interface IShareholderRepository
    {
        IEnumerable<Shareholder> Shareholders { get; }
        IEnumerable<Shareholder> GetShareholders();
        Task<int> AddShareholder(Shareholder shareholder);
        Task<int> UpdateShareholder(Shareholder shareholder);
        Task<int> DeleteShareholder(int id);
    }
}
