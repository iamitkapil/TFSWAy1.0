using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using TFSWay.DomainModel.Entities;

namespace TFSWay.DomainModel.Abstract
{
   public  interface IStrategyProposalRepository
    {
        IEnumerable<StrategyProposal> StrategyProposals { get; }
        IEnumerable<StrategyProposal> GetStrategyProposals();
        Task<int> AddStrategyProposal(StrategyProposal strategyproposal);
        Task<int> UpdateStrategyProposal(StrategyProposal strategyproposal);
        Task<int> DeleteStrategyProposal(int id);
    }
}
