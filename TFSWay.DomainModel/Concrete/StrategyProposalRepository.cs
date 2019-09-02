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
   public class StrategyProposalRepository:IStrategyProposalRepository
    {
        private TFSWayDBContext db;
        public StrategyProposalRepository()
        {
            db = new Concrete.TFSWayDBContext();
        }

        public IEnumerable<StrategyProposal> StrategyProposals
        {
            get { return db.StrategyProposals; }
        }


        public IEnumerable<StrategyProposal> GetStrategyProposals()
        {
            return this.StrategyProposals;

        }

        public async Task<StrategyProposal> FetchbyStrategyProposalId(int strategyproposalid)
        {
            StrategyProposal StrategyProposal = await db.StrategyProposals.FindAsync(strategyproposalid);
            return StrategyProposal;
        }

        public async Task<int> AddStrategyProposal(StrategyProposal StrategyProposal)
        {
            db.StrategyProposals.Add(StrategyProposal);
            int result = await db.SaveChangesAsync();
            return result;
        }

        public async Task<int> UpdateStrategyProposal(StrategyProposal StrategyProposal)
        {
            StrategyProposal existingStrategyProposal = await FetchbyStrategyProposalId(StrategyProposal.StrategyProposalId);
            db.Entry(existingStrategyProposal).State = EntityState.Detached;
            db.Entry(StrategyProposal).State = EntityState.Modified;
            int result = await db.SaveChangesAsync();
            return result;
        }

        public async Task<int> DeleteStrategyProposal(int strategyproposalid)
        {
            StrategyProposal StrategyProposal = await FetchbyStrategyProposalId(strategyproposalid);
            db.StrategyProposals.Remove(StrategyProposal);
            int result = await db.SaveChangesAsync();
            return result;
        }
    }
}
