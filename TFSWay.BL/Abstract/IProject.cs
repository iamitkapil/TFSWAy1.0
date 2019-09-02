using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using TFSWay.DomainModel.Entities;
using TFSWay.BL.Model;

namespace TFSWay.BL.Abstract
{
    public interface IProject
    {
        IEnumerable<Project> GetProjects();

        IEnumerable<ProjectCompanyModel> GetDashBoardData(int EmployeeId, string designation);
        ProjectCompanyModel GetProjectCompany(int projectid);
        int GetLastProjectID();
        Task<String> AddProject(Project project);
        Task<String> UpdateProjectCompany(Project project);
        String DeleteProject(int projectid);
        Project GetProject(int projectid);
        Task<string> UpdateProject(Project project);
    }
}
