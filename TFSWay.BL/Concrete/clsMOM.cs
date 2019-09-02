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
    public class clsMOM : IMOM
    {
        private IMOMRepository MOMRepository;


        public clsMOM(IMOMRepository momrepository)
        {
            this.MOMRepository = momrepository;
        }

        public IEnumerable<MOM> GetMOMs()
        {
            var mom = MOMRepository.GetMOMs();
            return mom;
        }

        public IEnumerable<MOM> GetMOMs(int projectid)
        {
            IEnumerable<MOM> momList = new List<MOM>();
            momList = GetMOMs().Where(c => (c.ProjectId == projectid));
            return momList;
        }

        public IEnumerable<MOM> GetMOMTasks(int projectid)
        {
            IEnumerable<MOM> momList = new List<MOM>();
            momList = GetMOMs().Where(c => (c.ProjectId == projectid && c.MOMType == "Task"));
            return momList;
        }


        public async Task<int> AddMOM(MOM mom)
        {

            int insertedmomid = await MOMRepository.AddMOM(new MOM { ProjectId = mom.ProjectId, MOMType = mom.MOMType, MeetingDate = mom.MeetingDate, Minutes = mom.Minutes, TaskComplitionDate = mom.TaskComplitionDate, CreatedDate = mom.CreatedDate, CreatedBy = mom.CreatedBy });

            return insertedmomid > 0 ? insertedmomid : 0;

        }

        public async Task<string> UpdateMOM(MOM moms)
        {

            MOM mom = MOMRepository.GetMOMs().FirstOrDefault(c => c.MOMId == moms.MOMId);

            if (mom == default(MOM))
                return "projectplan doen't exist";
            else
            {
                if (moms.TaskComplitionDate == null)
                    mom.MeetingDate = moms.MeetingDate.Value;
                else
                {
                    mom.Status = moms.Status;
                    mom.TaskComplitionDate = moms.TaskComplitionDate.Value;
                }
            }

            int updatemom = await MOMRepository.UpdateMOM(mom);

            return updatemom == 0 ? "Successfully updated Meeting and Minutes record" : "Updation failed";

        }
        public string DeleteMOM(int momid)
        {
            MOM mom = MOMRepository.GetMOMs().SingleOrDefault(c => c.MOMId == momid);

            int deletedmom = Task.Run<int>(async () => await MOMRepository.DeleteMOM(momid)).Result;
            return deletedmom > 0 ? "Successfully Deleted project plan record" : "Deletion failed";
        }

        public string GeMOMMailBody(string momIds)
        {
            string QueryMailBody = "";
            string mailBody = "<br/><br/>Please find the Minutes of meeting <br/>";
            List<int> intmomlist = momIds.Split(',').Select(int.Parse).ToList();

            IEnumerable<MOM> momlist = new List<MOM>();
            momlist = GetMOMs().Where(c => intmomlist.Contains(c.MOMId));

            string strrow = "";
            foreach (MOM mom in momlist)
            {

                strrow = strrow + "<br/>" + mom.Minutes;

            }
            QueryMailBody = mailBody + strrow;

            return QueryMailBody;
        }
    }
}
