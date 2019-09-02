using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using TFSWay.BL.Model;

namespace TFSWay.BL.Extensions
{
    public  static class QueryExtensionMethods
    {

        public static IEnumerable<QueryReplyModel> Add<QueryReplyModel>(this IEnumerable<QueryReplyModel> e, QueryReplyModel value)
        {
            foreach (var cur in e)
            {
                yield return cur;
            }
            yield return value;
        }

    }
}
