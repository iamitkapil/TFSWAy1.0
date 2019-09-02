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
    public class ProjectRepository : IProjectRepository
    {
        private TFSWayDBContext db;
        public ProjectRepository()
        {
            db = new Concrete.TFSWayDBContext();
        }

        public IEnumerable<Project> Projects
        {
            get { return db.Projects; }
        }


        public IEnumerable<Project> GetProjects()
        {
            return this.Projects;

        }

        public async Task<Project> FetchbyProjectId(int projectid)
        {
            Project Project = await db.Projects.FindAsync(projectid);
            return Project;
        }

        public async Task<int> AddProject(Project project)
        {
            db.Projects.Add(project);
            await db.SaveChangesAsync();
            int insertedprojectid = project.ProjectId;
            return insertedprojectid;
            
        }

        public async Task<int> UpdateProject(Project project)
        {
            Project existingProject = await FetchbyProjectId(project.ProjectId);
            db.Entry(existingProject).State = EntityState.Detached;
            db.Entry(project).State = EntityState.Modified;
            int result = await db.SaveChangesAsync();
            return result;
        }

        public async Task<int> DeleteProject(int projectid)
        {
            Project Project = await FetchbyProjectId(projectid);
            db.Projects.Remove(Project);
            int result = await db.SaveChangesAsync();
            return result;
        }

    }
}
