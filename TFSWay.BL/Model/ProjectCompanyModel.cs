using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using TFSWay.DomainModel.Entities;

namespace TFSWay.BL.Model
{
    public class ProjectCompanyModel
    {
        public ProjectCompanyModel(Project project, Group group, Company company, User projectmanager, User supervisor)
        {
            Project = project;
            Group = group;
            Company = company;
            ProjectManager = projectmanager;
            Supervisor = supervisor;
        }
        
        public Project Project;
        public Group Group;
        public Company Company;
        public User ProjectManager;
        public User Supervisor;
    }

    

}
