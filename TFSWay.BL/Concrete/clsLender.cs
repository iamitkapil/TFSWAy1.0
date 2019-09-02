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
    public class clsLender:ILender
    {
        private ILenderRepository LenderRepository;
        private ILenderMasterRepository LenderMasterRepository;

        public clsLender(ILenderRepository lenderRepository,ILenderMasterRepository lendermasterRepository)
        {
            this.LenderRepository = lenderRepository;
            this.LenderMasterRepository = lendermasterRepository;
        }

        public IEnumerable<LenderModel> GetLendersbyProjectID(int Id)
        {
            List<LenderModel> lendermodellist = new List<LenderModel>();
            var lenderList = LenderRepository.GetLenders().Where(p => p.ProjectId == Id);

            foreach (Lender lender in lenderList)
            {
                var lendermaster = LenderMasterRepository.MasterLenders.FirstOrDefault(c => c.LenderMasterId == lender.LenderMasterId);
                lendermodellist.Add(new LenderModel { LenderId = lender.LenderMasterId, ClientId = lender.ClientId, ProjectId = lender.ProjectId, LenderName = lendermaster.LenderName, LenderAddress = lendermaster.LenderAddress });
            }
            return lendermodellist;
        }
        public IEnumerable<LenderModel> GetLenders(int Id)
        {
            List<LenderModel> lendermodellist = new List<LenderModel>();
            var lenderList = LenderRepository.GetLenders().Where(p=>p.ClientId==Id);

            foreach (Lender lender in lenderList)
            {
                var lendermaster = LenderMasterRepository.MasterLenders.FirstOrDefault(c => c.LenderMasterId == lender.LenderMasterId);
                lendermodellist.Add(new LenderModel { LenderId = lender.LenderId, ClientId=lender.ClientId, ProjectId=lender.ProjectId, LenderName = lendermaster.LenderName, LenderAddress = lendermaster.LenderAddress });
            }
            return lendermodellist; 
        }

        public IEnumerable<LenderModel> GetMasterLenders()
        {
            List<LenderModel> lendermodellist = new List<LenderModel>();
            var lenderList = LenderMasterRepository.GetMasterLenders();

            foreach (LenderMaster lender in lenderList)
            {
                
                lendermodellist.Add(new LenderModel { LenderId = lender.LenderMasterId, LenderName = lender.LenderName, LenderAddress = lender.LenderAddress });
            }

            return lendermodellist;
        }

        public async Task<string> AddLender(LenderModel lender)
        {
            //Lender existinglender = LenderRepository.GetLenders().SingleOrDefault(p => p.LenderId == lender.LenderId);

            //if (existinglender == default(Lender))
            //    return "lender doesn't exist";
            int insertlenderMaster = 0;
            int insertlender = 0;
            if (lender.LenderId == 0)
                insertlenderMaster = await LenderMasterRepository.AddLenderMaster(new LenderMaster { LenderName = lender.LenderName, LenderAddress = lender.LenderAddress, CreatedDate = lender.CreatedDate, CreatedBy = lender.CreatedBy, UpdatedDate = lender.UpdatedDate, UpdatedBy = lender.UpdatedBy });
            else
                insertlender = await LenderRepository.AddLender(new Lender { ClientId=lender.ClientId=lender.ClientId , ProjectId = lender.ProjectId ,LenderMasterId=lender.LenderId, CreatedDate = lender.CreatedDate, CreatedBy = lender.CreatedBy , UpdatedDate = lender.UpdatedDate, UpdatedBy=lender.UpdatedBy });

            return (insertlenderMaster > 0 || insertlender >0) ? "Successfully added Lender" : "Insertion failed";

        }

        public async Task<string> UpdateLender(LenderModel lender)
        {
            //Lender existinglender = LenderRepository.GetLenders().SingleOrDefault(p => p.LenderId == lender.LenderId);

            //if (existinglender == default(Lender))
            //    return "lender doesn't exist";
            int updatelenderMaster = 0;
            LenderMaster lendermaster = LenderMasterRepository.MasterLenders.FirstOrDefault(c => c.LenderMasterId == lender.LenderId);

            if (lendermaster == default(LenderMaster))
                return "Lender doesn't exist";
            else
            {
                lendermaster.LenderName = lender.LenderName;
                lendermaster.LenderAddress = lender.LenderAddress;
                lendermaster.UpdatedDate = lender.UpdatedDate;
                lendermaster.UpdatedBy = lender.UpdatedBy;
               
            }

            updatelenderMaster = await LenderMasterRepository.UpdateLenderMaster(lendermaster);

            return updatelenderMaster > 0 ? "Successfully updated Master Lender" : "Updation failed";

        }

    }
}
