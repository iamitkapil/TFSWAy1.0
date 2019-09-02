using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using TFSWay.BL.Abstract;
using TFSWay.DomainModel.Entities;
using TFSWay.BL.Model;
using System.Threading.Tasks;

namespace TFSWay.WebApi.Controllers
{
    public class StrategyProposalController :ApiController
    {
        private IStrategyProposal _strategyproposal;

        public StrategyProposalController(IStrategyProposal strategyproposal)
        {
            _strategyproposal = strategyproposal;
        }


        [HttpGet]
        public IEnumerable<StrategyProposal> GetStrategyProposals(int id)
        {
            var strategyproposals = _strategyproposal.GetStrategyProposals(id);
            return strategyproposals;
        }

        [HttpGet]
        [Route("api/StrategyProposal/GetNewStrategyProposal/{projectid}")]
        public ProjectStrategyProposalModel GetNewStrategyProposal(int projectid)
        {
            var strategyproposal = _strategyproposal.GetNewStrategyProposal(projectid);
            return strategyproposal;

        }

        [HttpGet]
        public ProjectStrategyProposalModel GetStrategyProposal(int id)
        {
            var strategyproposal = _strategyproposal.GetStrategyProposal(id);
            return strategyproposal;

        }

        

        [HttpPost]
        public IHttpActionResult PostStrategyProposal(StrategyProposal strategyproposal)
        {
            if (!ModelState.IsValid)
                return BadRequest("Not a valid model");
            Task.Run(async () => await _strategyproposal.AddStrategyProposal(strategyproposal));
            return Ok();
        }

        [HttpPut]
        public IHttpActionResult UpdateStrategyProposal(StrategyProposal strategyproposal)
        {
            if (!ModelState.IsValid)
                return BadRequest("Not a valid model");
            Task.Run(async () => await _strategyproposal.UpdateStrategyProposal(strategyproposal));
            return Ok();
        }


    }
}