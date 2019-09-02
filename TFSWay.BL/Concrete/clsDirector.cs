using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using TFSWay.BL.Abstract;
using TFSWay.BL.Model;
using TFSWay.DomainModel.Entities;
using TFSWay.DomainModel.Abstract;

namespace TFSWay.BL.Concrete
{
    //public enum DirectorType { Project , Director };

    public class clsDirector : IDirector
    {
        private IDirectorRepository DirectorRepository;
        private IPromoterRepository PromoterRepository;
        private ICompanyRepository CompanyRepository;

        public clsDirector(IDirectorRepository directorRepository,
                            IPromoterRepository promoterRepository,
                            ICompanyRepository companyRepository)
        {
            this.DirectorRepository = directorRepository;
            this.PromoterRepository = promoterRepository;
            this.CompanyRepository = companyRepository;
        }

        // For the purpose of Auto Popualation in the 
        public IEnumerable<DirectorListModel> GetDirectorsLookupList()
        {
            IEnumerable<Director> DirectorsList = DirectorRepository.Directors.GroupBy(g => new { g.Name, g.PAN, g.Address}).Select(g => g.First());
            List<DirectorListModel> DirectorlookupList = new List<DirectorListModel>();
            foreach (Director director in DirectorsList)
            {
                DirectorlookupList.Add(new DirectorListModel
                {
                    Name = director.Name,
                    Address = director.Address,
                    DIN = director.DIN,
                    PAN = director.PAN,
                    Qualification = director.Qualification,
                    ExpRelSector = director.ExpRelSector,
                    CompSharehold = director.CompSharehold,
                });
            }
                
            return DirectorlookupList;
        }

        public IEnumerable<DirectorListModel> GetAllDirectors(int companyId)
        {
            List<DirectorListModel> directorlist = new List<DirectorListModel>();
            IEnumerable<Director> directors = DirectorRepository.Directors.Where(d => d.CompanyId == companyId);

            foreach (Director director in directors)
            {
                if (director.DirectorType == DirectorType.Promoter.ToString())
                {
                    Promoter promoter = PromoterRepository.Promoters.SingleOrDefault(p => p.PromoterId == director.DirectorPromoterId);
                    if (promoter != default(Promoter))
                        directorlist.Add(new DirectorListModel
                        {
                            DirectorId = director.DirectorId,
                            CompanyId = director.CompanyId,
                            DirectorType = director.DirectorType,
                            DirectorPromoterId = director.DirectorPromoterId,
                            CompanyName = default(string),
                            PromoterName = promoter.Name,
                            Name = director.Name,
                            Address = director.Address,
                            DIN = director.DIN,
                            PAN = director.PAN,
                            Qualification = director.Qualification,
                            ExpRelSector = director.ExpRelSector,
                            CompSharehold = director.CompSharehold,
                            IsMainDirector = director.IsMainDirector,
                            CreatedDate = director.CreatedDate,
                            CreatedBy = director.CreatedBy
                        });
                }
                else
                {
                    Company company = CompanyRepository.Companys.SingleOrDefault(c => c.CompanyId == director.CompanyId);
                    directorlist.Add(new DirectorListModel
                    {
                        DirectorId = director.DirectorId,
                        CompanyId = director.CompanyId,
                        DirectorType = director.DirectorType,
                        DirectorPromoterId = director.DirectorPromoterId,
                        CompanyName = company.CompanyName,
                        PromoterName = default(string),
                        Name = director.Name,
                        Address = director.Address,
                        DIN = director.DIN,
                        PAN = director.PAN,
                        Qualification = director.Qualification,
                        ExpRelSector = director.ExpRelSector,
                        CompSharehold = director.CompSharehold,
                        IsMainDirector = director.IsMainDirector,
                        CreatedDate = director.CreatedDate,
                        CreatedBy = director.CreatedBy
                    });
                }
            }
            return directorlist;
        }

        public async Task<string> AddDirector(Director director)
        {
            int insertdirector = await DirectorRepository.AddDirector(director);
            return insertdirector == 0 ? "Successfully added Director" : "Insertion failed";
        }

        public async Task<string> UpdateDirector(Director director)
        {

            // ProjectCompanyDetail projectcompanydet
            Director existingdirector = DirectorRepository.Directors.SingleOrDefault(d => d.DirectorId == director.DirectorId);

            if (existingdirector == default(Director))
                return "Director doesn't exist";


            int updatedirector = await DirectorRepository.UpdateDirector(director);

            return updatedirector > 0 ? "Successfully updated Direcotr" : "Updation failed";

        }

        public string DeleteDirector(int directorid)
        {

            int deletedirector = Task.Run<int>(async () => await DirectorRepository.DeleteDirector(directorid)).Result;
            return deletedirector > 0 ? "Successfully deleted Director record" : "Deletion failed";
        }

        public Director GetDirector(int directorid)
        {
            Director director = DirectorRepository.Directors.SingleOrDefault(d => d.DirectorId == directorid);
            return director;

        }
    }

}
