using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using TFSWay.BL.Abstract;
using TFSWay.DomainModel.Abstract;
using TFSWay.DomainModel.Entities;

namespace TFSWay.BL.Concrete
{
    public class Customer : ICustomer
    {
        private ICustomerRepository  CustomerRepository;

        public Customer(ICustomerRepository customerRepository)
        {
            this.CustomerRepository = customerRepository;
        }

        public async Task<int> AddCustomer(DomainModel.Entities.Customer customer)
        {
            int insertcustomer = await CustomerRepository.AddCustomer(customer);
            return insertcustomer >0 ? insertcustomer : 0;
             
        }

        public string DeleteCustomer(int customerid)
        {
            //if (object.Equals(default(Customer))) : return customer doesn't exist
            
           ////if (Task.Run<TFSWay.DomainModel.Entities.Customer>(async () => await CustomerRepository.FetchbyCustomerId(customerid)).Result.Equals(default(DomainModel.Entities.Customer)))
           //// {                
           ////    return "Customer doen't exist";
           //// }
            int deletecustomer = Task.Run<int>(async () => await CustomerRepository.DeleteCustomer(customerid)).Result;
            return deletecustomer == 0 ? "Successfully Deleted customer record" : "Deletion failed";
        }

        public async Task<IEnumerable<TFSWay.DomainModel.Entities.Customer>> GetCustomers()
        {
            var customersList = await CustomerRepository.GetCustomers();
            return customersList;
        }

        public async Task<IEnumerable<string>> GetCustomersFirstName()
        {
            var customersList = await CustomerRepository.GetCustomers();

            List<string> customernames = new List<string>();
            foreach (TFSWay.DomainModel.Entities.Customer customer in customersList)
            {
                customernames.Add(customer.CustomerFirstName);
            }

            return customernames;
        }

        public TFSWay.DomainModel.Entities.Customer CustomerDetails(int customerid)
        {

            //TFSWay.DomainModel.Entities.Customer customer = await CustomerRepository.FetchbyCustomerId(customerid);
            //TFSWay.DomainModel.Entities.Customer customer = Task.Run<IEnumerable<TFSWay.DomainModel.Entities.Customer>>(async () => await CustomerRepository.GetCustomers()).Result.FirstOrDefault(c => c.CustomerId == customerid);
            TFSWay.DomainModel.Entities.Customer customer = Task.Run<TFSWay.DomainModel.Entities.Customer>(async () => await CustomerRepository.FetchbyCustomerId(customerid)).Result;
            return customer;
        }

        public async Task<string> UpdateCustomer(DomainModel.Entities.Customer customer)
        {
            DomainModel.Entities.Customer existingcustomer = await CustomerRepository.FetchbyCustomerId(customer.CustomerId);
            if (existingcustomer.Equals(default(DomainModel.Entities.Customer)))
              return "Customer doen't exist";
            int updatecustomer = await CustomerRepository.UpdateCustomer(customer);
            return updatecustomer == 0 ? "Successfully updated customer record" : "Updation failed";

        }
    }
}
