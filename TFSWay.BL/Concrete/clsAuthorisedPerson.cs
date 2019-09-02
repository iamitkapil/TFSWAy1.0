using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using TFSWay.BL.Abstract;
using TFSWay.DomainModel.Entities;
using TFSWay.DomainModel.Abstract;
using TFSWay.BL.Model;

namespace TFSWay.BL.Concrete
{
    public class clsAuthorisedPerson : IAuthorisedPerson
    {

        private IAuthorisedPersonRepository AuthorisedPersonRepository;
        private IPromoterRepository PromoterRepository;
        private ICompanyRepository CompanyRepository;
        private IAgencyRepository AgencyRepository;

        public clsAuthorisedPerson(IAuthorisedPersonRepository authorisedpersonRepository,
            IPromoterRepository promoterRepository,
            ICompanyRepository companyRepository,
            IAgencyRepository agencyRepository)
        {
            this.AuthorisedPersonRepository = authorisedpersonRepository;
            this.PromoterRepository = promoterRepository;
            this.CompanyRepository = companyRepository;
            this.AgencyRepository = agencyRepository;
        }

        // For the purpose of Auto Popualation in the 
        public IEnumerable<AuthorisedPersonModel> GetAuthorisedPersonDetailList()
        {
            IEnumerable<AuthorisedPerson> AuthorisedpersonList = AuthorisedPersonRepository.AuthorisedPersons.GroupBy(g => new { g.Name,g.ContactNumber,g.Email}).Select(g=>g.First());
            List<AuthorisedPersonModel> AuthorisedpersonModelList = new List<AuthorisedPersonModel>();
            foreach (AuthorisedPerson authorisedperson in AuthorisedpersonList)
            {
                if (authorisedperson.AuthorisedPersonAgencyId == null)
                {
                    if (authorisedperson.AuthorisedPersonPromoterId != null)
                    {
                        Promoter promoter = PromoterRepository.Promoters.SingleOrDefault(p => p.PromoterId == authorisedperson.AuthorisedPersonPromoterId);
                        if (promoter != default(Promoter))
                            AuthorisedpersonModelList.Add(new AuthorisedPersonModel
                            {
                                CompanyId = authorisedperson.CompanyId,
                                Name = authorisedperson.Name,
                                Role = authorisedperson.Role,
                                ContactNumber = authorisedperson.ContactNumber,
                                LandlineNumber = authorisedperson.LandlineNumber,
                                Email = authorisedperson.Email,
                                AgencyType = "Promoter",
                            });
                    }
                    else
                    {
                        Company company = CompanyRepository.Companys.SingleOrDefault(c => c.CompanyId == authorisedperson.CompanyId);
                        if (company != default(Company))
                            AuthorisedpersonModelList.Add(new AuthorisedPersonModel
                            {
                                CompanyId = authorisedperson.CompanyId,
                                Name = authorisedperson.Name,
                                Role = authorisedperson.Role,
                                ContactNumber = authorisedperson.ContactNumber,
                                LandlineNumber = authorisedperson.LandlineNumber,
                                Email = authorisedperson.Email,
                                AgencyType = "Company",
                            });
                    }
                }
                else
                {
                    Agency agency = AgencyRepository.Agencys.SingleOrDefault(a => a.AgencyId == authorisedperson.AuthorisedPersonAgencyId);
                    if (agency != default(Agency))
                        AuthorisedpersonModelList.Add(new AuthorisedPersonModel
                        {
                            CompanyId = authorisedperson.CompanyId,
                            Name = authorisedperson.Name,
                            Role = authorisedperson.Role,
                            ContactNumber = authorisedperson.ContactNumber,
                            LandlineNumber = authorisedperson.LandlineNumber,
                            Email = authorisedperson.Email,
                            AgencyType = agency.AgencyType,
                            
                        });
                }
            }
            return AuthorisedpersonModelList;
        }
    

        public IEnumerable<AuthorisedPersonModel> GetAuthorisedPersons(int companyId)
        {
            IEnumerable<AuthorisedPerson> AuthorisedpersonList = AuthorisedPersonRepository.AuthorisedPersons.Where(c=> c.CompanyId == companyId);
            List<AuthorisedPersonModel> AuthorisedpersonModelList = new List<AuthorisedPersonModel>();
            foreach (AuthorisedPerson authorisedperson in AuthorisedpersonList)
            {
                if (authorisedperson.AuthorisedPersonAgencyId == null)
                {
                    if (authorisedperson.AuthorisedPersonPromoterId != null)
                    {
                        Promoter promoter = PromoterRepository.Promoters.SingleOrDefault(p => p.PromoterId == authorisedperson.AuthorisedPersonPromoterId);
                        if (promoter != default(Promoter))
                            AuthorisedpersonModelList.Add(new AuthorisedPersonModel
                            {
                                AuthorisedPersonId = authorisedperson.AuthorisedPersonId,
                                Name = authorisedperson.Name,
                                Role = authorisedperson.Role,
                                ContactNumber = authorisedperson.ContactNumber,
                                IsCoordinator = authorisedperson.IsCoordinator,
                                Email = authorisedperson.Email,
                                AgencyType = "Promoter",
                                AgencyName = promoter.Name,
                                AgencyAddress = promoter.OfficeAddress
                            });
                    }
                    else
                    {
                        Company company = CompanyRepository.Companys.SingleOrDefault(c => c.CompanyId == authorisedperson.CompanyId);
                        if (company != default(Company))
                            AuthorisedpersonModelList.Add(new AuthorisedPersonModel
                            {
                                AuthorisedPersonId = authorisedperson.AuthorisedPersonId,
                                Name = authorisedperson.Name,
                                Role = authorisedperson.Role,
                                ContactNumber = authorisedperson.ContactNumber,
                                IsCoordinator = authorisedperson.IsCoordinator,
                                Email = authorisedperson.Email,
                                AgencyType = "Company",
                                AgencyName = company.CompanyName,
                                AgencyAddress = company.RegisteredAddress
                            });
                    }
                }
                else
                {
                    Agency agency = AgencyRepository.Agencys.SingleOrDefault(a => a.AgencyId == authorisedperson.AuthorisedPersonAgencyId);
                    if (agency != default(Agency))
                        AuthorisedpersonModelList.Add(new AuthorisedPersonModel
                        {
                            AuthorisedPersonId = authorisedperson.AuthorisedPersonId,
                            Name = authorisedperson.Name,
                            Role = authorisedperson.Role,
                            IsCoordinator = authorisedperson.IsCoordinator,
                            ContactNumber = authorisedperson.ContactNumber,
                            Email = authorisedperson.Email,
                            AgencyType = agency.AgencyType,
                            AgencyName = agency.AgencyName,
                            AgencyAddress = agency.AgencyAddress
                        });
                }
            }
            return AuthorisedpersonModelList;
        }

        public AuthorisedPersonModel GetAuthorisedPerson(int authorisedpersonId)
        {
            AuthorisedPerson authorisedperson = AuthorisedPersonRepository.AuthorisedPersons.SingleOrDefault(ap => ap.AuthorisedPersonId == authorisedpersonId);
            AuthorisedPersonModel authorisedPersonModel = new AuthorisedPersonModel();
            if (authorisedperson.AuthorisedPersonAgencyId == null)
            {
                if (authorisedperson.AuthorisedPersonPromoterId != null)
                {
                    Promoter promoter = PromoterRepository.Promoters.SingleOrDefault(p => p.PromoterId == authorisedperson.AuthorisedPersonPromoterId);
                    if (promoter != default(Promoter))
                        authorisedPersonModel = new AuthorisedPersonModel
                        {
                            AuthorisedPersonId = authorisedperson.AuthorisedPersonId,
                            CompanyId = authorisedperson.CompanyId,
                            Name = authorisedperson.Name,
                            Role = authorisedperson.Role,
                            ContactNumber = authorisedperson.ContactNumber,
                            LandlineNumber = authorisedperson.LandlineNumber,
                            IsCoordinator = authorisedperson.IsCoordinator,
                            Email = authorisedperson.Email,
                            AgencyType = "Promoter",
                            AgencyName = promoter.Name,
                            AgencyAddress = promoter.OfficeAddress,
                            AuthorisedPersonAgencyId = authorisedperson.AuthorisedPersonAgencyId,
                            AuthorisedPersonPromoterId = authorisedperson.AuthorisedPersonPromoterId,
                            CreatedDate = authorisedperson.CreatedDate,
                            CreatedBy = authorisedperson.CreatedBy
                        };
                }
                else
                {
                    Company company = CompanyRepository.Companys.SingleOrDefault(c => c.CompanyId == authorisedperson.CompanyId);
                    if (company != default(Company))
                        authorisedPersonModel = new AuthorisedPersonModel
                        {
                            AuthorisedPersonId = authorisedperson.AuthorisedPersonId,
                            CompanyId = authorisedperson.CompanyId,
                            Name = authorisedperson.Name,
                            Role = authorisedperson.Role,
                            ContactNumber = authorisedperson.ContactNumber,
                            LandlineNumber = authorisedperson.LandlineNumber,
                            IsCoordinator = authorisedperson.IsCoordinator,
                            Email = authorisedperson.Email,
                            AgencyType = "Company",
                            AgencyName = company.CompanyName,
                            AgencyAddress = company.RegisteredAddress,
                            AuthorisedPersonAgencyId = authorisedperson.AuthorisedPersonAgencyId,
                            AuthorisedPersonPromoterId = authorisedperson.AuthorisedPersonPromoterId,
                            CreatedDate = authorisedperson.CreatedDate,
                            CreatedBy = authorisedperson.CreatedBy
                        };
                }
            }
            else
            {
                Agency agency = AgencyRepository.Agencys.SingleOrDefault(a => a.AgencyId == authorisedperson.AuthorisedPersonAgencyId);
                if (agency != default(Agency))
                    authorisedPersonModel = new AuthorisedPersonModel
                    {
                        AuthorisedPersonId = authorisedperson.AuthorisedPersonId,
                        CompanyId = authorisedperson.CompanyId,
                        Name = authorisedperson.Name,
                        Role = authorisedperson.Role,
                        IsCoordinator = authorisedperson.IsCoordinator,
                        ContactNumber = authorisedperson.ContactNumber,
                        LandlineNumber = authorisedperson.LandlineNumber,
                        Email = authorisedperson.Email,
                        AgencyType = agency.AgencyType,
                        AgencyName = agency.AgencyName,
                        AgencyAddress = agency.AgencyAddress,
                        AuthorisedPersonAgencyId = authorisedperson.AuthorisedPersonAgencyId,
                        AuthorisedPersonPromoterId = authorisedperson.AuthorisedPersonPromoterId,
                        CreatedDate = authorisedperson.CreatedDate,
                        CreatedBy = authorisedperson.CreatedBy
                    };
            }

            return authorisedPersonModel;
        }


        public async Task<string> AddAuthorisedPerson(AuthorisedPerson authorisedperson)
        {

            int insertauthorisedperson = await AuthorisedPersonRepository.AddAuthorisedPerson(authorisedperson);

            return insertauthorisedperson > 0 ? "Successfully inserted AuthorisedPerson" : "Insertion failed";

        }


        public async Task<string> UpdateAuthorisedPerson(AuthorisedPerson authorisedperson)
        {

            // ProjectCompanyDetail projectcompanydet
            AuthorisedPerson existingauthorisedperson = AuthorisedPersonRepository.AuthorisedPersons.SingleOrDefault(ap => ap.AuthorisedPersonId == authorisedperson.AuthorisedPersonId);

            if (existingauthorisedperson == default(AuthorisedPerson))
                return "AuthorisedPerson doesn't exist";


            int updateauthorisedperson = await AuthorisedPersonRepository.UpdateAuthorisedPerson(authorisedperson);

            return updateauthorisedperson > 0 ? "Successfully updated Authorised Person" : "Updation failed";

        }

        public string DeleteAuthorisedPerson(int authorisedpersonid)
        {

            int deleteauthorisedperson = Task.Run<int>(async () => await AuthorisedPersonRepository.DeleteAuthorisedPerson(authorisedpersonid)).Result;
            return deleteauthorisedperson > 0 ? "Successfully Deleted Authorised Person" : "Deletion failed";
        }
    }
}
