using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using TFSWay.DomainModel.Entities;

namespace TFSWay.DomainModel.Abstract
{
    public interface IAuthorisedPersonRepository
    {
        IEnumerable<AuthorisedPerson> AuthorisedPersons { get; }
        IEnumerable<AuthorisedPerson> GetAuthorisedPersons();
        Task<int> AddAuthorisedPerson(AuthorisedPerson authorisedperson);
        Task<int> UpdateAuthorisedPerson(AuthorisedPerson authorisedperson);
        Task<int> DeleteAuthorisedPerson(int id);
    }
}
