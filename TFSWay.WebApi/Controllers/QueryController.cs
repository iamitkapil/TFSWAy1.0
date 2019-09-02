using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using TFSWay.BL.Abstract;
using TFSWay.DomainModel.Entities;
using TFSWay.BL.Model;
using System.Threading.Tasks;

namespace TFSWay.WebApi.Controllers
{
    public class QueryController : ApiController
    {
        private IQuery _query;

        public QueryController(IQuery query)
        {
            _query = query;
        }


        [HttpGet]
        public IEnumerable<Query> GetQueries()
        {
            var query = _query.GetQueries();
            return query;
        }

        public QueryReplyModel GetQueryReplyByID(int? id)
        {
            if (id == null)
            {
                throw new HttpResponseException(HttpStatusCode.BadRequest);
            }
            QueryReplyModel queryreply = _query.GeQueryDataById((int)id);
            return queryreply;
        }

        [HttpGet]
        [Route("api/Query/GetReplies/{queryId}")]
        public IEnumerable<Reply> GetReplies(int queryId)
        {
            var reply = _query.GetReplies(queryId);
            return reply;
        }

        [HttpGet]
        [Route("api/Query/GetQueries/{projectId}")]
        public IEnumerable<QueryReplyModel> GetQueries(int projectId)
        {
            return _query.GeQueryData(projectId);
        }

        [HttpGet]
        [Route("api/Query/GetExporttoExcelQueries/{projectId}/{queryIds}")]
        public IEnumerable<QueryReplyModel> GeQueryExporttoExcelData(int projectId,string queryIds)
        {
            return _query.GeQueryExporttoExcelData(projectId, queryIds);
        }

        public IHttpActionResult PostQueryReply(QueryReplyModel queryreply)
        {
            if (!ModelState.IsValid)
                return BadRequest("Invalid data.");
            Task.Run(async () => await _query.AddQuery(queryreply));
            return Ok();
        }

        public IHttpActionResult PostReply(Reply reply)
        {
            if (!ModelState.IsValid)
                return BadRequest("Invalid data.");
            Task.Run(async () => await _query.AddReply(reply));
            return Ok();
        }

        [HttpDelete]
        [Route("api/Query/DeleteQuery/{queryid}")]
        public IHttpActionResult DeleteQuery(int queryid)
        {
            if (queryid > 0 && _query.DeleteQuery(queryid).ToString() != "Deletion failed")
                return Ok();
            else
                return BadRequest("Not a valid Project id");
        }

        [HttpDelete]
        [Route("api/Query/DeleteReply/{replyid}")]
        public IHttpActionResult DeleteReply(int replyid)
        {
            if (replyid > 0 && _query.DeleteReply(replyid).ToString() != "Deletion failed")
                return Ok();
            else
                return BadRequest("Not a valid Project id");
        }

        [HttpPut]
        public IHttpActionResult UpdateReply(Reply reply)
        {
            if (!ModelState.IsValid)
                return BadRequest("Not a valid model");
            Task.Run(async () => await _query.UpdateReply(reply));
            return Ok();
        }

        [HttpPut]
        public IHttpActionResult UpdateQueryReply(QueryReplyModel queryreply)
        {
            if (!ModelState.IsValid)
                return BadRequest("Not a valid model");
            Task.Run(async () => await _query.UpdateQuery(queryreply));
            return Ok();
        }
    }
}
