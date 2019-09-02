using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.ComponentModel;
using System.ComponentModel.DataAnnotations;

namespace TFSWay.DomainModel.Entities
{
    public class AuthorisedPerson
    {
        [Key]
        public int AuthorisedPersonId { get; set; }
        public int? CompanyId { get; set; }
        public string Name { get; set; }
        public string Role { get; set; }
        public string ContactNumber { get; set; }
        public string LandlineNumber { get; set; }
        public string Email { get; set; }
        public int? AuthorisedPersonAgencyId { get; set; }
        public int? AuthorisedPersonPromoterId { get; set; }
        public string IsCoordinator { get; set; }
        public DateTime? CreatedDate { get; set; }
        public string CreatedBy { get; set; }
        public DateTime? UpdatedDate { get; set; }
        public string UpdatedBy { get; set; }
    }
}
