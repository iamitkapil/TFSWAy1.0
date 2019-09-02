using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.ComponentModel.DataAnnotations;

namespace TFSWay.DomainModel.Entities
{
    public class User
    {
        public int UserID { get; set; }
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public string EmployeeId { get; set; }
        public string Designation{ get; set; }
        public string Email { get; set; }
        public string ContactNo{ get; set; }
        public string Password{ get; set; }
        [DataType(DataType.Date)]
        public DateTime CreatedDate { get; set; }
        public string CreatedBy { get; set; }
        [DataType(DataType.Date)]
        public DateTime UpdatedDate { get; set; }
        public string UpdatedBy { get; set; }

    }
}
