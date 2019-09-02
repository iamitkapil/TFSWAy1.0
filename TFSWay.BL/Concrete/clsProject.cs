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
    public class ClsProject : IProject
    {
        private IProjectRepository ProjectRepository;
        //private IClientDetailRepository ClientDetailRepository;
        private IPromoterRepository PromoterRepository;
        private IUserRepository UserRepository;
        private ICostBreakupRepository CostBreakupRepository;
        private ICompanyRepository CompanyRepository;
        private IGroupRepository GroupRepository;
        //private ClsMail Mail;

        public ClsProject(IProjectRepository projectRepository,
            IClientDetailRepository clientDetailRepository, IUserRepository authorisedPersonRepository,
            IPromoterRepository promoterRepository, ICostBreakupRepository costBreakupRepository,
            ICompanyRepository companyRepository, IGroupRepository groupRepository/*, ClsMail mail*/)
        {
            this.ProjectRepository = projectRepository;
            this.GroupRepository = groupRepository;
            this.CompanyRepository = companyRepository;
            this.UserRepository = authorisedPersonRepository;
            this.PromoterRepository = promoterRepository;
            this.CostBreakupRepository = costBreakupRepository;
            //this.Mail = mail;
        }


        public ProjectCompanyModel GetProjectCompany(int projectid)
        {
            ProjectCompanyModel projectCompanyModel;

            Project project = ProjectRepository.Projects.SingleOrDefault(p => p.ProjectId == projectid);
            Group group = GroupRepository.Groups.SingleOrDefault(g => g.GroupId == project.GroupId);
            Company company = CompanyRepository.Companys.SingleOrDefault(c => c.CompanyId == project.CompanyId);
            User projectmanager = UserRepository.GetUsers().SingleOrDefault(c => c.UserID == project.ProjectManagerId);
            User supervisor = UserRepository.GetUsers().SingleOrDefault(c => c.UserID == project.SupervisorId);

            projectCompanyModel = new ProjectCompanyModel(project, group, company, projectmanager, supervisor);


            return projectCompanyModel;
        }

        public IEnumerable<Project> GetProjects()
        {
            var projectList = ProjectRepository.GetProjects();
            return projectList;
        }

        public int GetLastProjectID()
        {
            int lastprojectID = 0;
            IEnumerable<Project> projectList = new List<Project>();
            projectList = ProjectRepository.Projects.OrderByDescending(c => c.ProjectId).Take(1);
            foreach (Project project in projectList)
            {
                lastprojectID = project.ProjectId;
            }
            return lastprojectID;
        }

        public IEnumerable<ProjectCompanyModel> GetDashBoardData(int EmployeeId, string designation)
        {
            List<ProjectCompanyModel> DashBoardlist = new List<ProjectCompanyModel>();
            IEnumerable<Project> projectList = new List<Project>();

            if (designation == UserType.PM.ToString())
                projectList = ProjectRepository.Projects.Where(c => c.ProjectManagerId == EmployeeId);
            else if (designation == UserType.Supervisor.ToString())
                projectList = ProjectRepository.Projects.Where(c => c.SupervisorId == EmployeeId);
            else
                projectList = ProjectRepository.Projects;

            foreach (Project project in projectList)
            {
                var group = GroupRepository.Groups.SingleOrDefault(g => g.GroupId == project.GroupId);
                var company = CompanyRepository.Companys.SingleOrDefault(c => c.GroupId == project.GroupId && c.CompanyId == project.CompanyId);
                var projectmanager = UserRepository.GetUsers().SingleOrDefault(c => c.UserID == project.ProjectManagerId);
                var supervisor = UserRepository.GetUsers().SingleOrDefault(c => c.UserID == project.SupervisorId);
                DashBoardlist.Add(new ProjectCompanyModel(project, group, company, projectmanager, supervisor));
            }
            return DashBoardlist;
        }


        public async Task<string> AddProject(Project project)
        {


            int insertedprojectid = await ProjectRepository.AddProject(new Project
            {
                GroupId = project.GroupId,
                CompanyId = project.CompanyId,
                ProjectName = project.ProjectName,
                ProjectSize = project.ProjectSize,
                ProjectStartDate = project.ProjectStartDate,
                ProjectEndDate = project.ProjectEndDate,
                TotalDebt = project.TotalDebt,
                Status = project.Status,
                CurrentStage = project.CurrentStage,
                Reason = project.Reason,
                ProjectManagerId = project.ProjectManagerId,
                SupervisorId = project.SupervisorId,
                LoaDate = project.LoaDate,
                RegisteredAddress = project.RegisteredAddress
            });

            int insertcostbreakup = await CostBreakupRepository.AddCostBreakup(new CostBreakup { ProjectID = insertedprojectid });

            return insertedprojectid > 0 ? "Successfully added Project" : "Insertion failed";

        }

        public string DeleteProject(int projectId)
        {
            CostBreakup costbreakup = CostBreakupRepository.CostBreakups.SingleOrDefault(c => c.ProjectID == projectId);
            int deletecostbreakup = Task.Run<int>(async () => await CostBreakupRepository.DeleteCostBreakup(costbreakup.CBID)).Result;
            Project project = ProjectRepository.Projects.SingleOrDefault(p => p.ProjectId == projectId);

            int deleteproject = Task.Run<int>(async () => await ProjectRepository.DeleteProject(projectId)).Result;
            return deleteproject > 0 ? "Successfully Deleted Project" : "Deletion failed";
        }



        //public async Task<string> UpdateProjectCompany(ProjectCompanyModel pcmodel)
        //{

        //    Project project = ProjectRepository.Projects.SingleOrDefault(p => p.ProjectId == pcmodel.Project.ProjectId);
        //     if (project == default(Project))
        //        return "project doen't exist";
        //    else
        //    {
        //        project.GroupId = pcmodel.Project.GroupId;
        //        project.CompanyId = pcmodel.Project.CompanyId;
        //        project.ProjectName = pcmodel.Project.ProjectName;
        //        project.ProjectSize = pcmodel.Project.ProjectSize;
        //        project.ProjectStartDate = pcmodel.Project.ProjectStartDate;
        //        project.ProjectEndDate = pcmodel.Project.ProjectEndDate;
        //        project.Status = pcmodel.Project.Status;
        //        project.TotalDebt = pcmodel.Project.TotalDebt;
        //        project.ProjectManagerId = pcmodel.Project.ProjectManagerId;
        //        project.SupervisorId = pcmodel.Project.SupervisorId;
        //    }
        //    int updateproject = await ProjectRepository.UpdateProject(project);
        //    return updateproject > 0 ? "Successfully updated project record" : "Updation failed";

        //}

        public Project GetProject(int projectid)
        {
            Project project = ProjectRepository.Projects.SingleOrDefault(c => c.ProjectId == projectid);
            return project;
        }

        public async Task<string> UpdateProject(Project project)
        {

            Project existingproject = ProjectRepository.Projects.SingleOrDefault(p => p.ProjectId == project.ProjectId);

            if (existingproject == default(Project))
                return "project doen't exist";
            if (project.TotalCost.GetValueOrDefault() != 0)
            {
                if (project.Capacity_AC.GetValueOrDefault() > 0)
                    project.CostperMW_AC = Math.Round((Convert.ToDecimal((project.TotalCost) / project.Capacity_AC.GetValueOrDefault())), 2);
                else
                    project.CostperMW_AC = 0;

                if (project.Capacity_DC.GetValueOrDefault() > 0)
                    project.CostperMW_DC = Math.Round((Convert.ToDecimal((project.TotalCost) / project.Capacity_DC.GetValueOrDefault())), 2);
                else
                    project.CostperMW_DC = 0;

                if (project.TotalDebt.GetValueOrDefault() > 0)
                    project.TotalEquity = project.TotalCost - project.TotalDebt;
            }
            if (project.TotalDebt.GetValueOrDefault() > 0 && project.TotalEquity.GetValueOrDefault() > 0)
            {
                //var gcd = GCD(Convert.ToInt32(project.TotalDebt), Convert.ToInt32(project.TotalEquity));

                project.DebtEquityRatio = Math.Round((Convert.ToDecimal((project.TotalDebt) / project.TotalEquity)), 2) + ":1";
                // project.DebtEquityRatio = Math.Round((Convert.ToDecimal(project.TotalDebt / project.TotalEquity)), 2) * 100;
            }
            else
            {
                project.DebtEquityRatio = default(String);
            }



            int updateproject = await ProjectRepository.UpdateProject(project);
            return updateproject > 0 ? "Successfully updated project  record" : "Updation failed";

        }

        //public int GCD(int a, int b)
        //{
        //    return b == 0 ? Math.Abs(a) : GCD(b, a % b);
        //}
        public async Task<string> UpdateProjectCompany(Project project)
        {
            Project existingproject = ProjectRepository.Projects.SingleOrDefault(p => p.ProjectId == project.ProjectId);

            if (existingproject == default(Project))
                return "project doen't exist";

            if (project.GroupId == 0 && project.CompanyId == 0 && project.ProjectStartDate == null)
            {
                existingproject.TotalDebt = project.TotalDebt;
                existingproject.ProjectSize = project.ProjectSize;
                existingproject.LoaDate = project.LoaDate;
                existingproject.Planttype = project.Planttype;
                existingproject.ProjectCapacityUnit = project.ProjectCapacityUnit;
                existingproject.ProjectTariffUnit = project.ProjectTariffUnit;
                existingproject.RegisteredAddress = project.RegisteredAddress;
                existingproject.Status = project.Status;
                existingproject.Reason = project.Reason;
                existingproject.UpdatedDate = project.UpdatedDate;
                existingproject.UpdatedBy = project.UpdatedBy;
            }
            else
            {

                existingproject.GroupId = project.GroupId;
                existingproject.CompanyId = project.CompanyId;
                existingproject.ProjectName = project.ProjectName;
                existingproject.ProjectSize = project.ProjectSize;
                existingproject.ProjectStartDate = project.ProjectStartDate;
                existingproject.ProjectEndDate = project.ProjectEndDate;
                existingproject.TotalDebt = project.TotalDebt;
                existingproject.LoaDate = project.LoaDate;
                existingproject.RegisteredAddress = project.RegisteredAddress;
                existingproject.SupervisorId = project.SupervisorId;
                existingproject.Planttype = project.Planttype;
                existingproject.ProjectCapacityUnit = project.ProjectCapacityUnit;
                existingproject.ProjectTariffUnit = project.ProjectTariffUnit;
                //if (existingproject.ProjectManagerId != project.ProjectManagerId)
                //{
                //    //SendMail mail for manager chnage
                //    string mailSent = Mail.SendMail(project.ProjectId, existingproject.ProjectManagerId.Value, project.ProjectManagerId.Value);
                //}
                existingproject.ProjectManagerId = project.ProjectManagerId;
                existingproject.Status = project.Status;
                existingproject.CurrentStage = project.CurrentStage;
                existingproject.Reason = project.Reason;
                existingproject.UpdatedDate = project.UpdatedDate;
                existingproject.UpdatedBy = project.UpdatedBy;
            }
            int updateproject = await ProjectRepository.UpdateProject(existingproject);
            return updateproject > 0 ? "Successfully updated project  record" : "Updation failed";

        }

    }
}

