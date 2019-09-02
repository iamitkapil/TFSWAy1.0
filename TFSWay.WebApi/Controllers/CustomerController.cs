using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using TFSWay.BL.Abstract;
using TFSWay.DomainModel.Entities;
using System.Threading.Tasks;
using System.Web.Http.Cors;


namespace TFSWay.WebApi.Controllers
{
    //[EnableCors(origins: "http://localhost:61096", headers: "*", methods: "*")]
    public class CustomerController : ApiController
    {
        private ICustomer _customer;

        public CustomerController(ICustomer customer)
        {
            _customer = customer;
        }
        
        public Customer GetCustomer(int? id)
        {
            if (id == null)
            {
                throw new HttpResponseException(HttpStatusCode.BadRequest);
            }
             Customer customer = _customer.CustomerDetails((int) id);
            return customer;
        }

        public async Task<IEnumerable<TFSWay.DomainModel.Entities.Customer>> GetCustomers()
        {
            var customers = await _customer.GetCustomers();
            return customers;
        }

        public async Task<IEnumerable<string>> GetCustomersFirstName()
        {
            var customers = await _customer.GetCustomersFirstName();
            return customers;
        }

        public IHttpActionResult PostCustomer(Customer  customer)
        {
            if (!ModelState.IsValid)
                return BadRequest("Invalid data.");
            int i = Task.Run<int>(async () => await _customer.AddCustomer(customer)).Result;
            return Ok(i);
        }

        [HttpDelete]
        public IHttpActionResult DeleteCustomer(int id)
        {
            if (id > 0 && _customer.DeleteCustomer(id).ToString() != "Customer doen't exist")
                return Ok();
            else
            return BadRequest("Not a valid customer id") ;
        }
         
        [HttpPut]
        public IHttpActionResult UpdateCustomer(Customer customer)
        {
            if (!ModelState.IsValid)
                return BadRequest("Not a valid model");
            Task.Run(async () => await _customer.UpdateCustomer(customer));
            return Ok();
        }


    }


}
