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
    public class ProjectPlanRepository : IProjectPlanRepository
    {

        private TFSWayDBContext db;
        public ProjectPlanRepository()
        {
            db = new Concrete.TFSWayDBContext();
        }

        public IEnumerable<ProjectPlan> ProjectPlans
        {
            get { return db.ProjectPlans; }
        }

        public IEnumerable<ProjectPlan> GetProjectPlans()
        {
            return this.ProjectPlans;

        }

        public async Task<int> AddProjectPlan(ProjectPlan projectplan)
        {
            db.ProjectPlans.Add(projectplan);
            await db.SaveChangesAsync();
            int insertedProjectPlanid = projectplan.ProjectPlanID;
            return insertedProjectPlanid;
        }

        public async Task<ProjectPlan> FetchbyDocumentById(int projectplanid)
        {
            ProjectPlan projectplan = await db.ProjectPlans.FindAsync(projectplanid);
            return projectplan;
        }



        public async Task<int> UpdateProjectPlan(ProjectPlan projectplan)
        {
            ProjectPlan existingProjectplan = await FetchbyDocumentById(projectplan.ProjectPlanID);
            db.Entry(existingProjectplan).State = EntityState.Detached;
            db.Entry(projectplan).State = EntityState.Modified;
            int result = await db.SaveChangesAsync();
            return result;
        }

        public async Task<int> DeleteProjectPlan(int projectplanid)
        {
            ProjectPlan projectplan = await FetchbyDocumentById(projectplanid);
            db.ProjectPlans.Remove(projectplan);
            int result = await db.SaveChangesAsync();
            return result;
        }

    }
}

