using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace TFSWay.BL.Model
{
    public class AuthorisedPersonModel
    {

        public int AuthorisedPersonId { get; set; }
        public int? CompanyId { get; set; }
        public string Name { get; set; }
        public string Role { get; set; }
        public string ContactNumber { get; set; }
        public string LandlineNumber { get; set; }
        public string Email { get; set; }
        public int? AuthorisedPersonAgencyId { get; set; }
        public int? AuthorisedPersonPromoterId { get; set; }
        public string AgencyType { get; set; }
        public string AgencyName { get; set; }
        public string AgencyAddress { get; set; }
        public string IsCoordinator { get; set; }
        public DateTime? CreatedDate { get; set; }
        public string CreatedBy { get; set; }


    }
}
