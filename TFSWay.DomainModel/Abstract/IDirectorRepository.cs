using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using TFSWay.DomainModel.Entities;

namespace TFSWay.DomainModel.Abstract
{
    public interface IDirectorRepository
    {
        IEnumerable<Director> Directors { get; }
        IEnumerable<Director> GetDirectors();
        Task<int> AddDirector(Director director);
        Task<int> UpdateDirector(Director director);
        Task<int> DeleteDirector(int id);
    }
}
