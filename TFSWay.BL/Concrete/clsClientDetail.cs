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
    public class ClsClientDetail:IClientDetail
    {
        private IClientDetailRepository ClientDetailRepository;

        public ClsClientDetail(IClientDetailRepository clientDetailRepository)
        {
            this.ClientDetailRepository = clientDetailRepository;
        }


        public IEnumerable<ClientDetail> GetClientDetails()
        {
            var clientDetailList = ClientDetailRepository.GetClientDetails();
            return clientDetailList;
        }

        public ClientDetail GetClientDetailbyProjectId(int projectId)
        {
            ClientDetail clientdetail = ClientDetailRepository.GetClientDetails().SingleOrDefault(c => c.ProjectID == projectId);
            return clientdetail;

        }

        public async Task<string> UpdateClientDetail(ClientDetail clientdetail)
        {

           // ProjectCompanyDetail projectcompanydetail = ProjectCompanyDetailRepository.ProjectCompanyDetails.FirstOrDefault(c => c.ProjectID == project.ProjectId);
           ClientDetail existingclientdetail = ClientDetailRepository.GetClientDetails().SingleOrDefault(c => c.ClientID == clientdetail.ClientID);

            if (existingclientdetail == default(ClientDetail))
                return "client doen't exist";
           

            int updateclient = await ClientDetailRepository.UpdateClientDetail(clientdetail);
            
            return updateclient == 0 ? "Successfully updated project and client record" : "Updation failed";

        }
    }
}
