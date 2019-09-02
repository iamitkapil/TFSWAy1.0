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
   public class clsTeaser:ITeaser
    {
        
        private ITeaserRepository TeaserRepository;
        private IProjectRepository ProjectRepository;
        private IDirectorRepository DirectorRepository;
        private IShareholderRepository ShareholderRepository;
        private IPromoterRepository PromoterRepository;
        private IGroupRepository GroupRepository;
        private ICompanyRepository CompanyRepository;
        private ClsMail Mail;
        public clsTeaser(ITeaserRepository teaserRepository, IProjectRepository projectRepository,
            IDirectorRepository directorRepository, IShareholderRepository shareholderRepository, 
            IPromoterRepository promoterRepository,
            IGroupRepository groupRepository, ICompanyRepository companyRepository, ClsMail mail)
        {
            this.TeaserRepository = teaserRepository;
            this.ProjectRepository = projectRepository;
            this.ShareholderRepository = shareholderRepository;
            this.DirectorRepository = directorRepository;
            this.PromoterRepository = promoterRepository;
            this.GroupRepository = groupRepository;
            this.CompanyRepository = companyRepository;
            this.Mail = mail;
        }


        public ProjectTeaserModel GetTeaser(int teaserid)
        {
            Teaser teaser = TeaserRepository.GetTeasers().FirstOrDefault(p => p.TeaserId == teaserid);
            Promoter promoter = PromoterRepository.GetPromoters().FirstOrDefault(p => p.PromoterId == teaser.PromoterId);
            Project project = ProjectRepository.Projects.FirstOrDefault(p => p.ProjectId == teaser.ProjectId);
            Company company = CompanyRepository.Companys.FirstOrDefault(c => c.CompanyId == project.CompanyId);
            Group group = GroupRepository.Groups.SingleOrDefault(g => g.GroupId == project.GroupId);

            IList<Director> directorslist = DirectorRepository.GetDirectors().Where(d => d.CompanyId == company.CompanyId && d.DirectorType == DirectorType.Company.ToString()).ToList();
            IList<Shareholder> shareholderslist = ShareholderRepository.GetShareholders().Where(s => s.CompanyId == company.CompanyId && (s.ShareholderType == ShareholderType.Company.ToString() || s.ShareholderType == ShareholderType.Others.ToString())).ToList();

            //promoterlist = PromoterRepository.GetPromoters().Where(p => p.ProjectID == projectid);
            ProjectTeaserModel ptmodel = new ProjectTeaserModel(project,company,group,promoter,teaser,directorslist,shareholderslist);

            return ptmodel;
        }

         public ProjectTeaserModel GetNewTeaser(int projectid)
        {
            Teaser teaser = default(Teaser);
            Project project = ProjectRepository.Projects.SingleOrDefault(p => p.ProjectId == projectid);
            Company company = CompanyRepository.Companys.SingleOrDefault(c => c.CompanyId == project.CompanyId);
            Group group = GroupRepository.Groups.SingleOrDefault(g => g.GroupId == project.GroupId);
            Promoter promoter = PromoterRepository.GetPromoters().FirstOrDefault(p => p.CompanyId == company.CompanyId && p.IsMainPromoter == "Yes");
            if(promoter == default(Promoter))
               promoter = PromoterRepository.GetPromoters().FirstOrDefault(p => p.CompanyId == company.CompanyId);


           // Project project = ProjectRepository.Projects.FirstOrDefault(p => p.ProjectId == promoter.ProjectId);

            
            IList<Director> directorslist = DirectorRepository.GetDirectors().Where(d => d.CompanyId == company.CompanyId && d.DirectorType == DirectorType.Company.ToString()).ToList();
            IList<Shareholder> shareholderslist = ShareholderRepository.GetShareholders().Where(s => s.CompanyId == company.CompanyId && (s.ShareholderType == ShareholderType.Company.ToString() || s.ShareholderType == ShareholderType.Others.ToString())).ToList();


            ProjectTeaserModel ptmodel = new ProjectTeaserModel(project,company,group, promoter, teaser, directorslist, shareholderslist);

            return ptmodel;
        }

        public IEnumerable<Teaser> GetTeasers(int projectid)
        {
            IEnumerable<Teaser> teaserlist = TeaserRepository.GetTeasers().Where(t => t.ProjectId == projectid);
            return teaserlist;
        }

        public async Task<string> AddTeaser(Teaser teaser)
        {
            string mailSent = "";
            string MailSubject = "Teaser";
            string MailBody = "";
            teaser.Status = "Created";
            if (teaser.Status == "Created")
                MailBody = "Project Teaser is created for <ProjectName>. Please review and approve /suggest.";

            int inserteaser = await TeaserRepository.AddTeaser(teaser);

            if (inserteaser > 0)
                mailSent = Mail.SendMail(teaser.ProjectId, teaser.Status, MailSubject, MailBody);


            return inserteaser > 0 ? "Successfully added Teaser" : "Insertion failed";

        }

        public async Task<string> UpdateTeaser(Teaser teaser)
        {
            string mailSent = "";
            string MailSubject = "Teaser";
            string MailBody = "";

            if (teaser.Status == "Approved")
                MailBody = "Project Teaser is Approved for <ProjectName>.";

            if (teaser.Status == "Rejected")
                MailBody = "Project Teaser is Rejected for <ProjectName> by following reason <br/><br/>" + teaser.Remarks;

            Teaser existingteaser = TeaserRepository.GetTeasers().SingleOrDefault(t => t.TeaserId == teaser.TeaserId);
            if (existingteaser == default(Teaser))
                return "teaser doesn't exist";
            int updateteaser = await TeaserRepository.UpdateTeaser(teaser);

            if (updateteaser > 0)
                mailSent = Mail.SendMail(teaser.ProjectId, teaser.Status, MailSubject, MailBody);

            return updateteaser == 0 ? "Successfully updated Teaser" : "Updation failed";
        }

    }
}
