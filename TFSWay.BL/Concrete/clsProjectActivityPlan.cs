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
    public class clsProjectActivityPlan : IProjectActivityPlan
    {
        private IProjectActivityPlanRepository ProjectActivityPlanRepository;
        private IProjectPlanRepository ProjectPlanRepository;
        private IActivitiesRepository ActivitiesRepository;
        private ClsMail Mail;
        private int ppParentID = 0;

        public clsProjectActivityPlan(IProjectPlanRepository projectplanrepository, IProjectActivityPlanRepository projectactivityplanrepository, IActivitiesRepository activitiesrepository, ClsMail mail)
        {
            this.ProjectActivityPlanRepository = projectactivityplanrepository;
            this.ActivitiesRepository = activitiesrepository;
            this.ProjectPlanRepository = projectplanrepository;
            this.Mail = mail;
        }

        public IEnumerable<ProjectActivityPlan> GetProjectActivityPlans()
        {
            var projectactivityplan = ProjectActivityPlanRepository.GetProjectActivityPlans();
            return projectactivityplan;
        }

        public IEnumerable<ActivityTemplate> GetStagesbyID(int projectid)
        {
            IEnumerable<ProjectActivityPlan> projectactivityplanlist = new List<ProjectActivityPlan>();
            IEnumerable<ActivityTemplate> stages = new List<ActivityTemplate>();
            List<ProjectActivityPlanModel> ProjectPlanModelList = new List<ProjectActivityPlanModel>();
            projectactivityplanlist = ProjectActivityPlanRepository.GetProjectActivityPlans().Where(c => c.ProjectID == projectid && c.ParentID == "0");
            List<string> templist = new List<string>();
            foreach (var projectplan in projectactivityplanlist)
            {
                templist.Add(projectplan.TemplateID);
            }

            stages = ActivitiesRepository.GetActivities().Where(c => templist.Contains(c.TemplateID));
            return stages;
        }

        public IEnumerable<ActivityModel> GetActivitiesbyID(int projectid, int templateid)
        {
            List<ActivityModel> ActivityModelList = new List<ActivityModel>();
            IEnumerable<ProjectActivityPlan> projectactivityplanlist = new List<ProjectActivityPlan>();
            projectactivityplanlist = ProjectActivityPlanRepository.GetProjectActivityPlans().Where(c => c.ProjectID == projectid && c.ParentID == templateid.ToString() && c.Task == null);

            foreach (var projectplan in projectactivityplanlist)
            {
                int value;
                string strActivity;
                if (int.TryParse(projectplan.Activity, out value))
                {
                    ActivityTemplate activity = ActivitiesRepository.GetActivities().FirstOrDefault(c => c.ActivityID == value);
                    strActivity = activity.Activity;
                }
                else
                    strActivity = projectplan.Activity;

                ActivityModelList.Add(new ActivityModel
                {
                    ActivityID = projectplan.TemplateID,
                    Activity = strActivity
                });
            }

            return ActivityModelList;
        }


        public IEnumerable<ProjectActivityPlanModel> GetProjectActivityPlansbyID(int projectid)
        {
            IEnumerable<ProjectActivityPlan> projectactivityplanlist = new List<ProjectActivityPlan>();
            List<ProjectActivityPlanModel> ProjectPlanModelList = new List<ProjectActivityPlanModel>();
            projectactivityplanlist = ProjectActivityPlanRepository.GetProjectActivityPlans().Where(c => c.ProjectID == projectid);
            foreach (ProjectActivityPlan projectplan in projectactivityplanlist)
            {
                if (projectplan.Activity != "")
                {
                    ActivityTemplate activitytemplate = ActivitiesRepository.GetActivities().FirstOrDefault(c => c.ActivityID.ToString() == projectplan.Activity);
                    if (activitytemplate != null)
                    {
                        string strActivity = "";
                        int value;
                        if (int.TryParse(projectplan.Activity, out value))
                            strActivity = activitytemplate.Activity;
                        else
                            strActivity = projectplan.Activity;
                        DateTime? SDate = null;
                        DateTime? EDate = null;
                        DateTime? CompDate = null;
                        string strStatus = "";
                        if (activitytemplate.TemplateID != "13")
                        {
                            SDate = projectplan.StartDate;
                            EDate = projectplan.EndDate;
                            CompDate = projectplan.ComplitionDate;
                            strStatus = projectplan.Status;
                        }

                        ProjectPlanModelList.Add(new ProjectActivityPlanModel
                        {
                            ProjectActivityPlanID = projectplan.ProjectActivityPlanID,
                            ProjectPlanID = projectplan.ProjectPlanID,
                            Activity = strActivity,
                            SrNo = activitytemplate.TemplateID,
                            ParentID = activitytemplate.ParentID.ToString(),
                            Dependency = projectplan.Dependency,
                            StartDate = SDate,
                            EndDate = EDate,
                            ComplitionDate = CompDate,
                            Status = strStatus
                        });
                    }
                    else
                    {
                        ProjectPlanModelList.Add(new ProjectActivityPlanModel
                        {
                            ProjectActivityPlanID = projectplan.ProjectActivityPlanID,
                            ProjectPlanID = projectplan.ProjectPlanID,
                            Activity = projectplan.Activity,
                            SrNo = projectplan.TemplateID,
                            Task = projectplan.Task,
                            ParentID = projectplan.ParentID,
                            Dependency = projectplan.Dependency,
                            StartDate = projectplan.StartDate,
                            EndDate = projectplan.EndDate,
                            ComplitionDate = projectplan.ComplitionDate,
                            Status = projectplan.Status
                        });
                    }
                }
            }
            return ProjectPlanModelList.OrderBy(c => decimal.Parse(c.SrNo));
        }
        public IEnumerable<ProjectActivityPlanModel> GetProjectActivityPlans(int projectId)
        {
            IEnumerable<ProjectActivityPlan> projectactivityplanlist = new List<ProjectActivityPlan>();
            List<ProjectActivityPlanModel> ProjectPlanModelList = new List<ProjectActivityPlanModel>();
            projectactivityplanlist = ProjectActivityPlanRepository.GetProjectActivityPlans().Where(c => c.ProjectID == projectId && c.Task == null);
            foreach (ProjectActivityPlan projectplan in projectactivityplanlist)
            {
                if (projectplan.Activity != "")
                {
                    ActivityTemplate activitytemplate = ActivitiesRepository.GetActivities().FirstOrDefault(c => c.ActivityID.ToString() == projectplan.Activity);
                    if (activitytemplate != null)
                    {
                        string strActivity = "";
                        int value;
                        if (int.TryParse(projectplan.Activity, out value))
                            strActivity = activitytemplate.Activity;
                        else
                            strActivity = projectplan.Activity;
                        DateTime? SDate = null;
                        DateTime? EDate = null;
                        if (activitytemplate.TemplateID != "13")
                        {
                            SDate = projectplan.StartDate;
                            EDate = projectplan.EndDate;
                        }

                        ProjectPlanModelList.Add(new ProjectActivityPlanModel
                        {
                            ProjectPlanID = projectplan.ProjectPlanID,
                            Activity = strActivity,
                            SrNo = activitytemplate.TemplateID,
                            ParentID = activitytemplate.ParentID.ToString(),
                            Dependency = projectplan.Dependency,
                            StartDate = SDate,
                            EndDate = EDate,
                            Delay = DateTime.Now.Subtract(EDate.Value.Date).Days
                        });
                    }
                    else
                    {
                        ProjectPlanModelList.Add(new ProjectActivityPlanModel
                        {
                            ProjectPlanID = projectplan.ProjectPlanID,
                            Activity = projectplan.Activity,
                            SrNo = projectplan.TemplateID,
                            ParentID = projectplan.ParentID,
                            Dependency = projectplan.Dependency,
                            StartDate = projectplan.StartDate,
                            EndDate = projectplan.EndDate,
                            Delay = DateTime.Now.Subtract(projectplan.EndDate.Value.Date).Days
                        });
                    }
                }
            }
            return ProjectPlanModelList.OrderBy(c => decimal.Parse(c.SrNo));
        }


        public bool IsActivitiesExist(int projectplanid, string activityid)
        {
            bool isactivitiesexist = false;
            if (activityid == "")
                return isactivitiesexist;

            ProjectActivityPlan projectactivityplan = new ProjectActivityPlan();

            projectactivityplan = ProjectActivityPlanRepository.GetProjectActivityPlans().FirstOrDefault(c => (c.ProjectPlanID == projectplanid && c.Activity == activityid));
            if (projectactivityplan != null)
                isactivitiesexist = true;

            return isactivitiesexist;
        }

        public int ValidateActivity(int projectplanid, int activityid)
        {
            string dependency = "";
            int activityStat = 0;
            if (activityid == 0)
                return activityStat;

            ProjectActivityPlan projectactivityplan = new ProjectActivityPlan();

            projectactivityplan = ProjectActivityPlanRepository.GetProjectActivityPlans().FirstOrDefault(c => (c.ProjectPlanID == projectplanid && c.Activity == activityid.ToString()));
            if (projectactivityplan != null)
                activityStat = 1;

            //activityid = activityid - 1;

            ActivityTemplate activity = ActivitiesRepository.GetActivities().FirstOrDefault(c => c.ActivityID == activityid);
            if (activity != null)
            {
                dependency = activity.Dependency;
            }
            if (dependency != "")
            {
                projectactivityplan = ProjectActivityPlanRepository.GetProjectActivityPlans().FirstOrDefault(c => (c.ProjectPlanID == projectplanid && c.TemplateID == dependency));
                if (projectactivityplan == null)
                    activityStat = 2;
            }

            return activityStat;
        }

        public string GetDependentDate(int activityid, int projectplanid, string type)
        {
            string dependency = "";

            string DepDate = "";

            ActivityTemplate activity = ActivitiesRepository.GetActivities().FirstOrDefault(c => c.ActivityID == activityid);
            if (activity != null)
            {
                dependency = activity.Dependency;

                ProjectActivityPlan projectactivityplan = ProjectActivityPlanRepository.GetProjectActivityPlans().FirstOrDefault(c => (c.ProjectPlanID == projectplanid && c.TemplateID == dependency));
                if (projectactivityplan != null)
                {
                    if (type == "StartDate")
                        DepDate = projectactivityplan.StartDate.Value.ToLongDateString();
                    if (type == "EndDate")
                        DepDate = projectactivityplan.EndDate.Value.ToLongDateString();
                }
            }


            return DepDate;
        }

        public bool IsTaskExist(int projectplanid, string task)
        {
            bool istaskexist = false;
            if (task == "")
                return istaskexist;

            ProjectActivityPlan projectactivityplan = ProjectActivityPlanRepository.GetProjectActivityPlans().FirstOrDefault(c => (c.ProjectPlanID == projectplanid && c.Activity == task));
            if (projectactivityplan != null)
                istaskexist = true;

            return istaskexist;
        }

        public bool IsProjectPlanExist(int projectid)
        {
            bool isprojectplanexist = false;
            ProjectPlan projectplan = ProjectPlanRepository.GetProjectPlans().FirstOrDefault(c => c.ProjectID == projectid);
            if (projectplan != null)
                isprojectplanexist = true;

            return isprojectplanexist;
        }

        public string GetTemplateID(int projectplanid, string activity, string ParentID, bool IsParent)
        {

            string TemplateID = "";
            if (IsParent)
            {
                ActivityTemplate activitytemplate = ActivitiesRepository.GetActivities().FirstOrDefault(c => c.TemplateID == ParentID);
                if (activitytemplate != null)
                {
                    TemplateID = activitytemplate.TemplateID;
                    ppParentID = activitytemplate.ActivityID;
                }
            }
            else
            {
                int value;
                if (int.TryParse(activity, out value))
                {
                    ActivityTemplate activitytemplate = ActivitiesRepository.GetActivities().FirstOrDefault(c => c.ActivityID == value);
                    if (activitytemplate != null)
                        TemplateID = activitytemplate.TemplateID;
                }
                else
                {
                    int ParentRecordCount = 0;
                    ActivityTemplate activitytemplate = ActivitiesRepository.GetActivities().FirstOrDefault(c => c.TemplateID == ParentID);

                    if (activitytemplate != null)
                        if (activitytemplate.Activity != "Others")
                            ParentRecordCount = ActivitiesRepository.GetActivities().Count(p => p.ParentID.ToString() == ParentID);
                    if (ParentRecordCount > 0)
                        ParentRecordCount = ParentRecordCount - 1;


                    int RecordCount = ProjectActivityPlanRepository.GetProjectActivityPlans().Count(p => p.ParentID == ParentID && p.ProjectPlanID == projectplanid && isNumber(p.Activity) == false);
                    TemplateID = ParentID + "." + (ParentRecordCount + RecordCount + 1);

                }
            }

            return TemplateID;
        }
        public bool isNumber(string activity)
        {
            int value;
            if (int.TryParse(activity, out value))
                return true;
            else
                return false;

        }

        public bool IsParentExist(int projectplanid, string ParentID)
        {
            bool IsParentExist = false;
            string templateID = "";

            ActivityTemplate activitytemplate = ActivitiesRepository.GetActivities().FirstOrDefault(c => c.TemplateID == ParentID);
            if (activitytemplate != null)
                templateID = activitytemplate.TemplateID;
            ProjectActivityPlan projectactivityplan = ProjectActivityPlanRepository.GetProjectActivityPlans().FirstOrDefault(c => (c.ProjectPlanID == projectplanid && c.TemplateID == templateID));
            if (projectactivityplan != null)
            {
                IsParentExist = true;
            }
            else
            {

                ppParentID = Convert.ToInt32(templateID);

            }

            return IsParentExist;
        }
        public async Task<int> AddProjectActivityPlan(ProjectActivityPlan projectactivityplan)
        {
            string mailSent = "";
            string MailSubject = "Delay in Activity Completion";
            string MailBody = "Following Activity is delayed to complete as per plan.";

            int insertedprojectplanid = 0;
            int projectplanid = 0;
            if (!IsProjectPlanExist(projectactivityplan.ProjectID))
            {
                projectplanid = await ProjectPlanRepository.AddProjectPlan(new ProjectPlan { ProjectID = projectactivityplan.ProjectID, ProjectPlanStatus = "Created", ReopenReason = "", CreatedDate = projectactivityplan.CreatedDate, CreatedBy = projectactivityplan.CreatedBy });
            }
            else
            {
                projectplanid = projectactivityplan.ProjectPlanID;
            }
            if (!IsActivitiesExist(projectplanid, projectactivityplan.Activity))
            {
                if (!IsParentExist(projectplanid, projectactivityplan.ParentID))
                {
                    string strTemplateID = this.GetTemplateID(projectplanid, projectactivityplan.Activity, projectactivityplan.ParentID, true);
                    insertedprojectplanid = await ProjectActivityPlanRepository.AddProjectActivityPlan(new ProjectActivityPlan { ProjectID = projectactivityplan.ProjectID, ProjectPlanID = projectplanid, Activity = ppParentID.ToString(), TemplateID = strTemplateID, ParentID = "0", Dependency = "", StartDate = projectactivityplan.StartDate, EndDate = projectactivityplan.EndDate, ComplitionDate = projectactivityplan.ComplitionDate, Status = projectactivityplan.Status, CreatedDate = projectactivityplan.CreatedDate, CreatedBy = projectactivityplan.CreatedBy });
                }
                insertedprojectplanid = await ProjectActivityPlanRepository.AddProjectActivityPlan(new ProjectActivityPlan { ProjectID = projectactivityplan.ProjectID, ProjectPlanID = projectplanid, Activity = projectactivityplan.Activity, TemplateID = this.GetTemplateID(projectplanid, projectactivityplan.Activity, projectactivityplan.ParentID, false), ParentID = projectactivityplan.ParentID, Dependency = projectactivityplan.Dependency, StartDate = projectactivityplan.StartDate, EndDate = projectactivityplan.EndDate, ComplitionDate = projectactivityplan.ComplitionDate, Status = projectactivityplan.Status, CreatedDate = projectactivityplan.CreatedDate, CreatedBy = projectactivityplan.CreatedBy });
                if (insertedprojectplanid > 0)
                {
                    ProjectActivityPlan objprojectactivityplan = ProjectActivityPlanRepository.GetProjectActivityPlans().FirstOrDefault(c => c.ProjectID == projectactivityplan.ProjectID && c.ProjectPlanID == projectplanid && c.TemplateID == projectactivityplan.ParentID);
                    if (objprojectactivityplan != null)
                    {
                        if (projectactivityplan.EndDate > objprojectactivityplan.EndDate)
                        {
                            objprojectactivityplan.EndDate = projectactivityplan.EndDate;
                            int updateprojectplan = await ProjectActivityPlanRepository.UpdateProjectActivityPlan(objprojectactivityplan);
                        }
                    }

                    if (projectactivityplan.EndDate < DateTime.Now)
                    {
                        int value;
                        string strActivity;
                        if (int.TryParse(projectactivityplan.Activity, out value))
                        {
                            ActivityTemplate activity = ActivitiesRepository.GetActivities().FirstOrDefault(c => c.ActivityID == value);
                            strActivity = activity.Activity;
                        }
                        else
                            strActivity = projectactivityplan.Activity;

                        MailBody = MailBody + "<br/><br/>" + "<b>Activity Name</b> : " + strActivity;
                        mailSent = await Mail.SendMailActivityPlan(projectactivityplan.ProjectID, "Delay", MailSubject, MailBody);
                    }
                }
            }
            return projectplanid > 0 ? projectplanid : 0;
        }

        public async Task<int> AddProjectTaskPlan(ProjectActivityPlan projectactivityplan)
        {

            int insertedprojectplanid = 0;
            string taskValue = "";
            if (!IsTaskExist(projectactivityplan.ProjectPlanID, projectactivityplan.Task))
            {
                int TaskCount = ProjectActivityPlanRepository.GetProjectActivityPlans().Count(c => (c.ProjectPlanID == projectactivityplan.ProjectPlanID && c.TemplateID == projectactivityplan.Activity));
                taskValue = projectactivityplan.Activity + "." + TaskCount.ToString();
                insertedprojectplanid = await ProjectActivityPlanRepository.AddProjectActivityPlan(new ProjectActivityPlan { ProjectID = projectactivityplan.ProjectID, ProjectPlanID = projectactivityplan.ProjectPlanID, Activity = projectactivityplan.Task, TemplateID = projectactivityplan.Activity, ParentID = projectactivityplan.ParentID, Task = taskValue, StartDate = projectactivityplan.StartDate, EndDate = projectactivityplan.EndDate, ComplitionDate = projectactivityplan.ComplitionDate, Status = projectactivityplan.Status, CreatedDate = projectactivityplan.CreatedDate, CreatedBy = projectactivityplan.CreatedBy });
            }
            return insertedprojectplanid > 0 ? insertedprojectplanid : 0;

        }
        public async Task<string> UpdateProjectActivityPlan(ProjectActivityPlan projectactivityplans)
        {
            string ParentID = "";
            int ProjectPlanID = 0;
            int ProjectID = 0;
            ProjectActivityPlan projectactivityplan = ProjectActivityPlanRepository.GetProjectActivityPlans().FirstOrDefault(c => c.ProjectActivityPlanID == projectactivityplans.ProjectActivityPlanID);

            if (projectactivityplan == default(ProjectActivityPlan))
                return "projectplan doen't exist";
            else
            {
                projectactivityplan.Status = projectactivityplans.Status;
                projectactivityplan.ComplitionDate = projectactivityplans.ComplitionDate.Value;
                ParentID = projectactivityplan.ParentID;
                ProjectPlanID = projectactivityplan.ProjectPlanID;
                ProjectID = projectactivityplan.ProjectID;
            }

            int updateprojectplan = await ProjectActivityPlanRepository.UpdateProjectActivityPlan(projectactivityplan);
            if (updateprojectplan > 0)
            {
                ProjectActivityPlan objprojectactivityplan = ProjectActivityPlanRepository.GetProjectActivityPlans().FirstOrDefault(c => c.ProjectID == ProjectID && c.ProjectPlanID == ProjectPlanID && c.TemplateID == ParentID);
                if (objprojectactivityplan != null)
                {
                    if (objprojectactivityplan.ComplitionDate != null)
                    {
                        if (projectactivityplans.ComplitionDate > objprojectactivityplan.ComplitionDate)
                        {

                            objprojectactivityplan.Status = projectactivityplans.Status;
                            objprojectactivityplan.ComplitionDate = projectactivityplans.ComplitionDate.Value;
                            int updateParent = await ProjectActivityPlanRepository.UpdateProjectActivityPlan(objprojectactivityplan);
                        }
                    }
                    else
                    {
                        objprojectactivityplan.Status = projectactivityplans.Status;
                        objprojectactivityplan.ComplitionDate = projectactivityplans.ComplitionDate.Value;
                        int updateParent = await ProjectActivityPlanRepository.UpdateProjectActivityPlan(objprojectactivityplan);
                    }
                }
            }

            return updateprojectplan == 0 ? "Successfully updated projectplan and reply record" : "Updation failed";

        }
        public string DeleteProjectActivityPlan(int projectactivityplanid)
        {
            ProjectActivityPlan projectactivityplan = ProjectActivityPlanRepository.GetProjectActivityPlans().SingleOrDefault(c => c.ProjectActivityPlanID == projectactivityplanid);

            int deletedprojectplan = Task.Run<int>(async () => await ProjectActivityPlanRepository.DeleteProjectActivityPlan(projectactivityplanid)).Result;
            return deletedprojectplan > 0 ? "Successfully Deleted project plan record" : "Deletion failed";
        }

        public ProjectPlanStausGraphModel GetProjectBarGraphData(int projectid)
        {
            ProjectPlanStausGraphModel graphdata = null;
            List<string> activitylist = new List<string>();
            List<int> projectedlist = new List<int>();
            List<int> inprogresslist = new List<int>();
            List<int> delaylist = new List<int>();
            List<int> completelist = new List<int>();
            List<string> projectedlistcolor = new List<string>();
            List<string> inprogresslistcolor = new List<string>();
            List<string> delaylistcolor = new List<string>();
            List<string> completelistcolor = new List<string>();

            IEnumerable<ActivityTemplate> activitys = ActivitiesRepository.ActivityTemplates.Where(t => t.ParentID == 0);
            foreach (ActivityTemplate at in activitys)
            {
                //graphdata.ActivitiesList.Add(at.Activity);

                ProjectActivityPlan paplan = ProjectActivityPlanRepository.ProjectActivityPlans.SingleOrDefault(ap => ap.TemplateID == at.TemplateID && ap.ProjectID == projectid);
                if (paplan != default(ProjectActivityPlan))
                {
                    activitylist.Add(at.Activity);
                    int days = 0;

                    TimeSpan ts = (Convert.ToDateTime(paplan.EndDate) - Convert.ToDateTime(paplan.StartDate));
                    days = ts.Days;
                    projectedlist.Add(days);
                    if (paplan.ComplitionDate != null)
                    {
                        ts = (Convert.ToDateTime(paplan.ComplitionDate) - Convert.ToDateTime(paplan.StartDate));
                        days = ts.Days;
                        completelist.Add(days);
                        inprogresslist.Add(0);
                        ts = (Convert.ToDateTime(paplan.ComplitionDate) - Convert.ToDateTime(paplan.EndDate));
                        days = ts.Days;
                        if (days > 0)
                        {
                            ts = (Convert.ToDateTime(paplan.ComplitionDate) - Convert.ToDateTime(paplan.StartDate));
                            days = ts.Days;
                            delaylist.Add(days);
                        }
                        else
                            delaylist.Add(0);
                    }
                    else
                    {
                        ts = DateTime.Now - Convert.ToDateTime(paplan.EndDate);
                        days = ts.Days;
                        if (days > 0)
                        {
                            completelist.Add(0);
                            inprogresslist.Add(0);
                            ts = DateTime.Now - Convert.ToDateTime(paplan.StartDate);
                            days = ts.Days;
                            delaylist.Add(days);
                        }
                        else if (days <= 0)
                        {
                            completelist.Add(0);
                            delaylist.Add(0);
                            ts = DateTime.Now - Convert.ToDateTime(paplan.StartDate);
                            days = ts.Days;
                            if (days >= 0)
                                inprogresslist.Add(days);
                            else
                                inprogresslist.Add(0);

                        }
                    }

                    projectedlistcolor.Add("#F4DE8D");
                    inprogresslistcolor.Add("#7BBFEA");
                    completelistcolor.Add("#78C87A");
                    delaylistcolor.Add("#FF0000");
                }

                List<Barchartdata> barchartdatalist = new List<Barchartdata> { new Barchartdata { Data = projectedlist, Label = "Projected" }, new Barchartdata { Data = inprogresslist, Label = "InProgress" }, new Barchartdata { Data = delaylist, Label = "Delay" }, new Barchartdata { Data = completelist, Label = "Complete" } };
                graphdata = new ProjectPlanStausGraphModel(activitylist, barchartdatalist, new List<BarchartColor> { new BarchartColor { BackgroundColor = projectedlistcolor }, new BarchartColor { BackgroundColor = inprogresslistcolor }, new BarchartColor { BackgroundColor = delaylistcolor }, new BarchartColor { BackgroundColor = completelistcolor } });
            }
            return graphdata;
        }
    }
}
