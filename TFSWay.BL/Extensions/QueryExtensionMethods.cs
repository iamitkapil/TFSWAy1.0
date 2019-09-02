using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using TFSWay.BL.Model;

namespace TFSWay.BL.Extensions
{
    public  static class ExtensionMethods
    {

        public static IEnumerable<ProjectClientModel> Add<ProjectClientModel>(this IEnumerable<ProjectClientModel> e, ProjectClientModel value)
        {
            foreach (var cur in e)
            {
                yield return cur;
            }
            yield return value;
        }

    }
}
