using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using TFSWay.BL.Abstract;
using TFSWay.DomainModel.Entities;
using TFSWay.DomainModel.Abstract;
using TFSWay.BL.Model;
using TFSWay.BL.Extensions;

namespace TFSWay.BL.Concrete
{
    public class ClsProjectPlan : IProjectPlan
    {
        private IProjectPlanRepository ProjectPlanRepository;
        private ClsMail Mail;

        public ClsProjectPlan(IProjectPlanRepository projectplanrepository, ClsMail mail)
        {
            this.ProjectPlanRepository = projectplanrepository;
            this.Mail = mail;
        }

        public IEnumerable<ProjectPlan> GetProjectPlans()
        {
            var projectplan = ProjectPlanRepository.GetProjectPlans();
            return projectplan;
        }

        public IEnumerable<ProjectPlan> GetProjectPlans(int projectid)
        {
            IEnumerable<ProjectPlan> projectplanlist = new List<ProjectPlan>();
            projectplanlist = GetProjectPlans().Where(c => (c.ProjectID == projectid));
            return projectplanlist;
        }

        public async Task<string> AddProjectPlan(ProjectPlan projectplan)
        {

            int insertedprojectplanid = await ProjectPlanRepository.AddProjectPlan(new ProjectPlan { ProjectID = projectplan.ProjectID, ProjectPlanStatus = projectplan.ProjectPlanStatus, ReopenReason = projectplan.ReopenReason, CreatedDate = projectplan.CreatedDate, CreatedBy = projectplan.CreatedBy });

            return insertedprojectplanid != 0 ? "Successfully Insertion of project plan record" : "Insertion failed";

        }

        public async Task<string> UpdateProjectPlan(ProjectPlan projectplans)
        {
            string mailSent = "";
            string MailSubject = "Project Plan Status";
            string MailBody = "";
            ProjectPlan projectplan = ProjectPlanRepository.GetProjectPlans().FirstOrDefault(c => c.ProjectPlanID == projectplans.ProjectPlanID);

            if (projectplan == default(ProjectPlan))
                return "projectplan doen't exist";
            else
            {
                projectplan.ProjectPlanStatus = projectplans.ProjectPlanStatus;
                projectplan.ReopenReason = projectplans.ReopenReason;
                projectplan.CreatedDate = DateTime.Now;

            }

            if (projectplans.ProjectPlanStatus == "Submitted")
                MailBody = "Project Plan has been submitted.Kindly approve.";
            if (projectplans.ProjectPlanStatus == "Rejected")
                MailBody = "Project Plan has been rejected by following reason <br/><br/>" + projectplans.ReopenReason;
            if (projectplans.ProjectPlanStatus == "Approved")
                MailBody = "Project Plan has been Approved.";
            if (projectplans.ProjectPlanStatus == "ReOpened")
                MailBody = "Project Plan has been ReOpened by following reason <br/><br/>" + projectplans.ReopenReason;

            int updateprojectplan = await ProjectPlanRepository.UpdateProjectPlan(projectplan);

            if (updateprojectplan > 0)
                mailSent = Mail.SendMail(projectplans.ProjectID, projectplans.ProjectPlanStatus, MailSubject, MailBody);

            return updateprojectplan == 0 ? "Successfully updated projectplan and reply record" : "Updation failed";

        }
        public string DeleteProjectPlan(int projectplanid)
        {
            ProjectPlan projectplan = ProjectPlanRepository.GetProjectPlans().SingleOrDefault(c => c.ProjectPlanID == projectplanid);

            int deletedprojectplan = Task.Run<int>(async () => await ProjectPlanRepository.DeleteProjectPlan(projectplanid)).Result;
            return deletedprojectplan > 0 ? "Successfully Deleted project plan record" : "Deletion failed";
        }
    }
}
