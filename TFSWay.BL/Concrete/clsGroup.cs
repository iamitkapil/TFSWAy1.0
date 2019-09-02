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
    public class clsGroup : IGroup
    {
        private IProjectRepository ProjectRepository;
        private ICompanyRepository CompanyRepository;
        private IGroupRepository GroupRepository;
        private ICostBreakupRepository CostBreakupRepository;

        public clsGroup(IProjectRepository projectRepository,
           ICompanyRepository companyRepository, IGroupRepository groupRepository,
            ICostBreakupRepository costBreakupRepository)
        {
            this.ProjectRepository = projectRepository;
            this.CompanyRepository = companyRepository;
            this.GroupRepository = groupRepository;
            this.CostBreakupRepository = costBreakupRepository;
        }


        public IEnumerable<GroupCompanyModel> GetGCList()
        {
            List<GroupCompanyModel> GClist = new List<GroupCompanyModel>();
            IEnumerable<Group> grouplist = GroupRepository.Groups;
            foreach (Group group in grouplist)
            {
                IEnumerable<Company> companylist = CompanyRepository.Companys.Where(c=>c.GroupId == group.GroupId);
                foreach (Company company in companylist)
                {
                    GClist.Add(new GroupCompanyModel
                        {
                            GroupId = group.GroupId,
                            CompanyId = company.CompanyId,
                            GroupName = group.GroupName,
                            CompanyName = company.CompanyName,
                            RegisteredAddress = company.RegisteredAddress
                            
                        });

                    }

                }
            
            return GClist;
        }

        public IEnumerable<Group> GetGroups()
        {
            List<Group> groups = GroupRepository.Groups.ToList();
            return groups;
        }

        public IEnumerable<Company> GetCompanys()
        {
            List<Company> companys = CompanyRepository.Companys.ToList();
            return companys;
        }

         
        public GroupCompanyModel GetGC(int companyid)
        {
            GroupCompanyModel gcmodel;
            Company company = CompanyRepository.Companys.SingleOrDefault(c => c.CompanyId == companyid);
            Group group = GroupRepository.Groups.FirstOrDefault(g => g.GroupId == company.GroupId);
            gcmodel = new GroupCompanyModel
            {
                GroupId = group.GroupId,
                GroupName = group.GroupName,
                CompanyId = company.CompanyId,
                CompanyName = company.CompanyName,
                RegisteredAddress = company.RegisteredAddress
               
            };
            return gcmodel;
        }

        public async Task<string> UpdateGC(GroupCompanyModel gcpmodel)
        {
            Company company = CompanyRepository.Companys.FirstOrDefault(c => c.CompanyId == gcpmodel.CompanyId);
            Group group = GroupRepository.Groups.FirstOrDefault(g => g.GroupId == gcpmodel.GroupId);

            if (group == default(Group))
                return "Group doesn't exist";
            else
            {
                company.CompanyName = gcpmodel.CompanyName;
                company.RegisteredAddress = gcpmodel.RegisteredAddress;
                company.UpdatedDate = gcpmodel.UpdatedDate;
                company.UpdatedBy = gcpmodel.UpdatedBy;
                group.GroupName = gcpmodel.GroupName;
                group.UpdatedDate = gcpmodel.UpdatedDate;
                group.UpdatedBy = gcpmodel.UpdatedBy;
            }

            int updategcp = 0;
            updategcp = await GroupRepository.UpdateGroup(group);
            updategcp = await CompanyRepository.UpdateCompany(company);
           // updategcp = await ProjectRepository.UpdateProject(project);

            return updategcp > 0 ? "Successfully updated Group" : "Updation failed";
        }


        public String DeleteGC(GroupCompanyModel gcmodel)
        {
            Company company = CompanyRepository.Companys.SingleOrDefault(c => c.CompanyId == gcmodel.CompanyId);
            //int deletecostbreakup = Task.Run<int>(async () => await CostBreakupRepository.DeleteCostBreakup(costbreakup.CBID)).Result;
            //int deleteproject = Task.Run<int>(async () => await ProjectRepository.DeleteProject(gcpmodel.ProjectId)).Result;
            //int countprojects = ProjectRepository.Projects.Count(p => p.CompanyId == gcpmodel.CompanyId);
            //if (countcompany == 0)
            //{
            //    int deleteCompany =  Task.Run<int>(async () => await CompanyRepository.DeleteCompany(gcpmodel.CompanyId)).Result;
            //}

            IEnumerable<Project> projects = ProjectRepository.Projects.Where(p => p.CompanyId == company.CompanyId && p.GroupId == company.GroupId);

            foreach (Project project in projects)
            {
                Task.Run(async () => await ProjectRepository.DeleteProject(project.ProjectId));
                CostBreakup costbreakup = CostBreakupRepository.CostBreakups.SingleOrDefault(c => c.ProjectID == project.ProjectId);
                Task.Run(async () => await CostBreakupRepository.DeleteCostBreakup(costbreakup.CBID));
            }
            int deletecompany = Task.Run<int>(async () => await CompanyRepository.DeleteCompany(company.CompanyId)).Result;

            int countgroup = CompanyRepository.Companys.Count(c => c.GroupId == gcmodel.GroupId);
            if (countgroup == 0)
            {
                int deleteGroup = Task.Run<int>(async () => await GroupRepository.DeleteGroup(gcmodel.GroupId)).Result;
            }
            //Project project = ProjectRepository.Projects.FirstOrDefault(p => p.ProjectId == gcpmodel.ProjectId);

            return deletecompany > 0 ? "Successfully Deleted Group" : "Deletion failed";

        }

        public async Task<string> AddGC(GroupCompanyModel gcmodel)
        {
            int insertedgroupid = 0;
            int insertedCompanyid = 0;
     
            Group group = GroupRepository.Groups.FirstOrDefault(g => g.GroupName == gcmodel.GroupName);
            if (group != default(Group))
            {
                Company company = CompanyRepository.Companys.FirstOrDefault(c => c.CompanyName == gcmodel.CompanyName && c.GroupId == group.GroupId );
                if (company == default(Company))
                {
                    insertedCompanyid = await CompanyRepository.AddCompany(new Company { GroupId = group.GroupId, CompanyName = gcmodel.CompanyName, RegisteredAddress = gcmodel.RegisteredAddress, CreatedDate = gcmodel.CreatedDate, CreatedBy = gcmodel.CreatedBy });
                }
                
            }
            else
            {
                insertedgroupid = await GroupRepository.AddGroup(new Group { GroupName = gcmodel.GroupName, CreatedDate = gcmodel.CreatedDate, CreatedBy = gcmodel.CreatedBy });
                insertedCompanyid = await CompanyRepository.AddCompany(new Company { GroupId = insertedgroupid, CompanyName = gcmodel.CompanyName, RegisteredAddress = gcmodel.RegisteredAddress, CreatedDate = gcmodel.CreatedDate, CreatedBy = gcmodel.CreatedBy });
                //insertedProjectid = await ProjectRepository.AddProject(new Project { GroupId = insertedgroupid, CompanyId = insertedCompanyid, ProjectName = gcpmodel.ProjectName, CreatedDate = gcpmodel.CreatedDate, CreatedBy = gcpmodel.CreatedBy });
                //insertcostbreakup = await CostBreakupRepository.AddCostBreakup(new CostBreakup { ProjectID = insertedProjectid, CreatedDate = gcpmodel.CreatedDate, CreatedBy = gcpmodel.CreatedBy });
            }

            return insertedCompanyid > 0 ? "Successfully added Group and Company" : "Group and Company already exist";
        }

    }
}
