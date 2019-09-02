using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using TFSWay.DomainModel.Entities;
using TFSWay.BL.Model;


namespace TFSWay.BL.Abstract
{
    public interface IAuthorisedPerson
    {
        IEnumerable<AuthorisedPersonModel> GetAuthorisedPersonDetailList();
        IEnumerable<AuthorisedPersonModel> GetAuthorisedPersons(int companyId);
        AuthorisedPersonModel GetAuthorisedPerson(int authorisedpersonId);
        Task<string> AddAuthorisedPerson(AuthorisedPerson authorisedperson);
        Task<string> UpdateAuthorisedPerson(AuthorisedPerson authorisedperson);
        string DeleteAuthorisedPerson(int authorisedpersonid);
    }

    //public enum AuthorisedPersonType { Project, Promoter };
}
