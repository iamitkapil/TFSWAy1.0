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
    public class clsShareholder : IShareholder
    {
        private IShareholderRepository ShareholderRepository;
        private IPromoterRepository PromoterRepository;
        private ICompanyRepository CompanyRepository;

        public clsShareholder(IShareholderRepository shareholderRepository,
                           IPromoterRepository promoterRepository,
                            ICompanyRepository companyRepository)
        {
            this.ShareholderRepository = shareholderRepository;
            this.PromoterRepository = promoterRepository;
            this.CompanyRepository = companyRepository;
        }
        

         public IEnumerable<ShareholderListModel> GetShareholdersLookupList()
        {
            IEnumerable<Shareholder> ShareholdersList = ShareholderRepository.Shareholders.GroupBy(g => new { g.Name}).Select(g => g.First());
            List<ShareholderListModel> ShareholderlookupList = new List<ShareholderListModel>();
            foreach (Shareholder sh in ShareholdersList)
            {
                ShareholderlookupList.Add(new ShareholderListModel
                {
                    Name = sh.Name,
                    Share = sh.Share,
                    FaceValue = sh.FaceValue,
                    Percentage = sh.Percentage
                });
            }
                
            return ShareholderlookupList;
        }



        public IEnumerable<ShareholderListModel> GetAllShareholders(int companyId)
        {
            List<ShareholderListModel> shareholderlist = new List<ShareholderListModel>();
            IEnumerable<Shareholder> shareholders = ShareholderRepository.Shareholders.Where(d => d.CompanyId == companyId);

            foreach (Shareholder shareholder in shareholders)
            {
                if (shareholder.ShareholderType == ShareholderType.Promoter.ToString())
                {
                    Promoter promoter = PromoterRepository.Promoters.SingleOrDefault(p => p.PromoterId == shareholder.ShareholderPromoterId);
                    if (promoter != default(Promoter))
                        shareholderlist.Add(new ShareholderListModel
                        {
                            ShareholderId = shareholder.ShareholderId,
                            ShareholderType = shareholder.ShareholderType,
                            CompanyId = shareholder.CompanyId,
                            CompanyName = default(string),
                            ShareholderPromoterId = shareholder.ShareholderPromoterId,
                            PromoterName = promoter.Name,
                            Name = shareholder.Name,
                            Share = shareholder.Share,
                            FaceValue = shareholder.FaceValue,
                            Percentage = shareholder.Percentage,
                            IsMainShareholder = shareholder.IsMainShareholder,
                            CreatedDate = shareholder.CreatedDate,
                            CreatedBy = shareholder.CreatedBy
                        });
                }
                else
                {
                    Company company = CompanyRepository.Companys.SingleOrDefault(c => c.CompanyId == shareholder.CompanyId);
                    if (company != default(Company))
                        shareholderlist.Add(new ShareholderListModel
                        {
                            ShareholderId = shareholder.ShareholderId,
                            ShareholderType = shareholder.ShareholderType,
                            CompanyId = shareholder.CompanyId,
                            CompanyName = company.CompanyName,
                            ShareholderPromoterId = shareholder.ShareholderPromoterId,
                            PromoterName = default(string),
                            Name = shareholder.Name,
                            Share = shareholder.Share,
                            FaceValue = shareholder.FaceValue,
                            Percentage = shareholder.Percentage,
                            IsMainShareholder = shareholder.IsMainShareholder,
                            CreatedDate = shareholder.CreatedDate,
                            CreatedBy = shareholder.CreatedBy
                        });
                }
            }
            return shareholderlist;
        }


        public async Task<string> AddShareholder(Shareholder shareholder)
        {
            int insertshareholder = await ShareholderRepository.AddShareholder(shareholder);
            return insertshareholder == 0 ? "Successfully added Shareholder" : "Insertion failed";
        }

        public async Task<string> UpdateShareholder(Shareholder shareholder)
        {

            // ProjectCompanyDetail projectcompanydet
            Shareholder existingshareholder = ShareholderRepository.Shareholders.SingleOrDefault(d => d.ShareholderId == shareholder.ShareholderId);

            if (existingshareholder == default(Shareholder))
                return "Shareholder doesn't exist";


            int updateshareholder = await ShareholderRepository.UpdateShareholder(shareholder);

            return updateshareholder > 0 ? "Successfully updated Shareholder" : "Updation failed";

        }

        public string DeleteShareholder(int shareholderid)
        {

            int deleteshareholder = Task.Run<int>(async () => await ShareholderRepository.DeleteShareholder(shareholderid)).Result;
            return deleteshareholder > 0 ? "Successfully deleted Shareholder record" : "Deletion failed";
        }

        public Shareholder GetShareholder(int shareholderid)
        {
            Shareholder shareholder = ShareholderRepository.Shareholders.SingleOrDefault(d => d.ShareholderId == shareholderid);
            return shareholder;

        }

    }
}
