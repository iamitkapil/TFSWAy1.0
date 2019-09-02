using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using TFSWay.BL.Abstract;
using TFSWay.DomainModel.Entities;
using TFSWay.DomainModel.Abstract;

namespace TFSWay.BL.Concrete
{
   public class clsPromoter:IPromoter
    {
        private IPromoterRepository PromoterRepository;

        public clsPromoter(IPromoterRepository promoterRepository)
        {
            this.PromoterRepository = promoterRepository;
        }

        // For the purpose of Auto Popualation in the 
        public IEnumerable<Promoter> GetPromotersLookupList()
        {
            IEnumerable<Promoter> PromotersList = PromoterRepository.Promoters.GroupBy(g => new { g.Name, g.OfficeAddress, g.PAN }).Select(g => g.First());
            List<Promoter> PromoterlookupList = new List<Promoter>();
            foreach (Promoter promoter in PromotersList)
            {
                PromoterlookupList.Add(new Promoter
                {
                    Name = promoter.Name,
                    OfficeAddress = promoter.OfficeAddress,
                    CIN = promoter.CIN,
                    PAN = promoter.PAN,
                    ChangedName = promoter.ChangedName,
                    ChangedNameDate = promoter.ChangedNameDate,
                    IncorporationDate =promoter.IncorporationDate
                });
            }

            return PromoterlookupList;
        }

        public IEnumerable<Promoter> GetPromoters(int CompanyId)
        {
            var promoterList = PromoterRepository.Promoters.Where(p => p.CompanyId == CompanyId);
            return promoterList;
        }

        public Promoter GetPromoter(int promoterId)
        {
            Promoter promoter = PromoterRepository.GetPromoters().SingleOrDefault(p => p.PromoterId == promoterId);
            return promoter;

        }

        public async Task<string> UpdatePromoter(Promoter promoter)
        {

            // ProjectCompanyDetail projectcompanydetail = ProjectCompanyDetailRepository.ProjectCompanyDetails.FirstOrDefault(c => c.ProjectID == project.ProjectId);
            Promoter existingpromoter = PromoterRepository.GetPromoters().SingleOrDefault(p => p.PromoterId == promoter.PromoterId);

            if (existingpromoter == default(Promoter))
                return "promoter doesn't exist";


            int updatepromoter = await PromoterRepository.UpdatePromoter(promoter);

            return updatepromoter == 0 ? "Successfully updated Promoter" : "Updation failed";

        }

        public async Task<string> AddPromoter(Promoter promoter)
        {

            int insertpromoter = await PromoterRepository.AddPromoter(promoter);
            return insertpromoter > 0 ? "Successfully added Promoter" : "Insertion failed";

        }

        public string DeletePromoter(int promoterid)
        {
          
            int deletepromoter = Task.Run<int>(async () => await PromoterRepository.DeletePromoter(promoterid)).Result;
            return deletepromoter > 0 ? "Successfully Deleted promoter record" : "Deletion failed";
        }
    }
}
