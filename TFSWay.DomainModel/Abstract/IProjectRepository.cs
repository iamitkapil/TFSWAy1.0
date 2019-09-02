using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using TFSWay.DomainModel.Entities;

namespace TFSWay.DomainModel.Abstract
{
    public interface IProjectRepository
    {
        IEnumerable<Project> Projects { get; }
        IEnumerable<Project> GetProjects();
        Task<int> AddProject(Project Project);
        Task<int> UpdateProject(Project Project);
        Task<int> DeleteProject(int id);

    }
}
