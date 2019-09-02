using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace TFSWay.BL.Model
{
    public class ProjectPlanStausGraphModel
    {
        public ProjectPlanStausGraphModel(IEnumerable<string> activitiesList, IEnumerable<Barchartdata> graphdatalist ,IEnumerable<BarchartColor> graphcolorlist)
        {
            ActivitiesList = activitiesList;
            Graphdatalist = graphdatalist;
            Graphcolorlist = graphcolorlist;
        }
        public IEnumerable<string> ActivitiesList;
        public IEnumerable<Barchartdata> Graphdatalist;
        public IEnumerable<BarchartColor> Graphcolorlist; 
    }

    public class Barchartdata
    {
        public IEnumerable<int> Data;
        public string Label;
    }

    public class BarchartColor
    {
        public List<string> BackgroundColor ;
    }
}
