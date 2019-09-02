using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using TFSWay.DomainModel.Entities;


namespace TFSWay.BL.Abstract
{
    public interface ICustomer
    {
        Task<IEnumerable<Customer>> GetCustomers();
        Task<IEnumerable<string>> GetCustomersFirstName();
        Task<int> AddCustomer(Customer customer);
        Task<String> UpdateCustomer(Customer customer);
        String DeleteCustomer(int id);
        Customer CustomerDetails(int customerid);

    }

}
