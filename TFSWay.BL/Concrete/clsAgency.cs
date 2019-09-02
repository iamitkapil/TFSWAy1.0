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
    public class clsAgency:IAgency
    {
        private IAgencyRepository AgencyRepository;

        public clsAgency(IAgencyRepository agencyRepository)
        {
            this.AgencyRepository = agencyRepository;
        }


        public IEnumerable<Agency> GetAgencys(string agencytype)
        {
            var agencyList = agencytype==string.Empty ? AgencyRepository.Agencys: AgencyRepository.Agencys.Where(agency => agency.AgencyType == agencytype);
            return agencyList;
        }

        public Agency GetAgency(int agencyId)
        {
            Agency agency = AgencyRepository.GetAgencys().SingleOrDefault(p => p.AgencyId == agencyId);
            return agency;

        }

        public async Task<string> UpdateAgency(Agency agency)
        {

            // ProjectCompanyDetail projectcompanydet
            Agency existingagency = AgencyRepository.GetAgencys().SingleOrDefault(p => p.AgencyId == agency.AgencyId);

            if (existingagency == default(Agency))
                return "agency doesn't exist";


            int updateagency = await AgencyRepository.UpdateAgency(agency);

            return updateagency > 0 ? "Successfully updated Agency" : "Updation failed";

        }

        public async Task<string> AddAgency(Agency agency)
        {

            int insertagency = await AgencyRepository.AddAgency(agency);
            return insertagency > 0 ? "Successfully added Agency" : "Insertion failed";

        }

        public string DeleteAgency(int agencyid)
        {

            int deleteagency = Task.Run<int>(async () => await AgencyRepository.DeleteAgency(agencyid)).Result;
            return deleteagency > 0 ? "Successfully Deleted agency record" : "Deletion failed";
        }
    }
}
