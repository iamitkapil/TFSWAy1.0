using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using TFSWay.BL.Abstract;
using TFSWay.DomainModel.Entities;
using TFSWay.DomainModel.Abstract;
using TFSWay.BL.Model;

namespace TFSWay.BL.Concrete
{
    public class clsStrategyProposal : IStrategyProposal
    {
        private IStrategyProposalRepository StrategyProposalRepository;
        private IProjectRepository ProjectRepository;
        private IGroupRepository GroupRepository;
        private ClsMail Mail;

        public clsStrategyProposal(IStrategyProposalRepository strategyproposalRepository,
            IProjectRepository projectRepository,
            IGroupRepository groupRepository, ClsMail mail)
        {
            this.StrategyProposalRepository = strategyproposalRepository;
            this.ProjectRepository = projectRepository;
            this.GroupRepository = groupRepository;
            this.Mail = mail;
        }


        public ProjectStrategyProposalModel GetStrategyProposal(int strategyproposalid)
        {
            StrategyProposal strategyproposal = StrategyProposalRepository.GetStrategyProposals().FirstOrDefault(p => p.StrategyProposalId == strategyproposalid);

            Project project = ProjectRepository.Projects.SingleOrDefault(p => p.ProjectId == strategyproposal.ProjectId);
            Group group = GroupRepository.Groups.SingleOrDefault(g => g.GroupId == project.GroupId);

            //promoterlist = PromoterRepository.GetPromoters().Where(p => p.ProjectID == projectid);
            ProjectStrategyProposalModel ptmodel = new ProjectStrategyProposalModel(project, strategyproposal, group);

            return ptmodel;
        }

        public ProjectStrategyProposalModel GetNewStrategyProposal(int projectid)
        {
            StrategyProposal strategyproposal = default(StrategyProposal);

            Project project = ProjectRepository.Projects.SingleOrDefault(p => p.ProjectId == projectid);
            Group group = GroupRepository.Groups.SingleOrDefault(g => g.GroupId == project.GroupId);

            //promoterlist = PromoterRepository.GetPromoters().Where(p => p.ProjectID == projectid);
            ProjectStrategyProposalModel ptmodel = new ProjectStrategyProposalModel(project, strategyproposal, group);

            return ptmodel;
        }

        public IEnumerable<StrategyProposal> GetStrategyProposals(int projectid)
        {
            IEnumerable<StrategyProposal> strategyproposallist = StrategyProposalRepository.GetStrategyProposals().Where(t => t.ProjectId == projectid);
            return strategyproposallist;
        }

        public async Task<string> AddStrategyProposal(StrategyProposal strategyproposal)
        {
            string mailSent = "";
            string MailSubject = "Strategy Proposal";
            string MailBody = "";
            strategyproposal.Status = "Created";

            if (strategyproposal.Status == "Created")
                MailBody = "Project Strategy Proposal is created for <ProjectName>. Please review and approve /suggest.";

            int inserstrategyproposal = await StrategyProposalRepository.AddStrategyProposal(strategyproposal);

            if (inserstrategyproposal > 0)
                mailSent = Mail.SendMail(strategyproposal.ProjectId, strategyproposal.Status, MailSubject, MailBody);

            return inserstrategyproposal > 0 ? "Successfully added StrategyProposal" : "Insertion failed";

        }

        public async Task<string> UpdateStrategyProposal(StrategyProposal strategyproposal)
        {
            string mailSent = "";
            string MailSubject = "Strategy Proposal";
            string MailBody = "";

            if (strategyproposal.Status == "Approved")
                MailBody = "Project Strategy Proposal is Approved for <ProjectName>.";

            if (strategyproposal.Status == "Rejected")
                MailBody = "Project Strategy Proposal is Rejected for <ProjectName> by following reason <br/><br/>" + strategyproposal.Remarks;

            StrategyProposal existingstrategyproposal = StrategyProposalRepository.GetStrategyProposals().SingleOrDefault(t => t.StrategyProposalId == strategyproposal.StrategyProposalId);
            if (existingstrategyproposal == default(StrategyProposal))
                return "strategyproposal doesn't exist";
            int updatestrategyproposal = await StrategyProposalRepository.UpdateStrategyProposal(strategyproposal);

            if (updatestrategyproposal > 0)
                mailSent = Mail.SendMail(strategyproposal.ProjectId, strategyproposal.Status, MailSubject, MailBody);

            return updatestrategyproposal == 0 ? "Successfully updated StrategyProposal" : "Updation failed";
        }
    }
}
