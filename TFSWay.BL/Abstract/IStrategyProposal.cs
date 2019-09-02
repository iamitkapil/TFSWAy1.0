using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using TFSWay.DomainModel.Entities;
using TFSWay.BL.Model;

namespace TFSWay.BL.Abstract
{
    public interface IStrategyProposal
    {

        ProjectStrategyProposalModel GetStrategyProposal(int strategyproposalid);
        ProjectStrategyProposalModel GetNewStrategyProposal(int projectid);
        Task<string> AddStrategyProposal(StrategyProposal strategyproposal);
        IEnumerable<StrategyProposal> GetStrategyProposals(int projectid);
        Task<string> UpdateStrategyProposal(StrategyProposal strategyproposal);
    }
}
