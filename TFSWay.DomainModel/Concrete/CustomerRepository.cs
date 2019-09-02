using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using TFSWay.DomainModel.Abstract;
using TFSWay.DomainModel.Entities;
using System.Data.Entity;

namespace TFSWay.DomainModel.Concrete
{
   public class CustomerRepository : ICustomerRepository
    {
        private TFSWayDBContext db;
        public CustomerRepository()
        {
            db = new Concrete.TFSWayDBContext();
        }

        public async Task<IEnumerable<Customer>> GetCustomers()
        {
            return await db.Customers.ToListAsync();
        }

        public async Task<Customer> FetchbyCustomerId(int id)
        {
            Customer customer = await db.Customers.FindAsync(id);
            return customer ;
        }

        public async Task<int> AddCustomer(Customer customer)
        {
            db.Customers.Add(customer);
            await db.SaveChangesAsync();
            int insertedcustomerid = customer.CustomerId;
            return insertedcustomerid;
        }

        public async Task<int> UpdateCustomer(Customer customer)
        {
            Customer existingcustomer = await FetchbyCustomerId(customer.CustomerId);
            db.Entry(existingcustomer).State = EntityState.Detached;
            db.Entry(customer).State = EntityState.Modified;
            int result = await db.SaveChangesAsync();
            return result;
        }

        public async Task<int> DeleteCustomer(int Customerid)
        {
            Customer customer = await FetchbyCustomerId(Customerid);
            db.Customers.Remove(customer);
            int result = await db.SaveChangesAsync();
            return result;
        }
    }
}
