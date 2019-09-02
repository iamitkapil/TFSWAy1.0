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
    public class DocumentController : ApiController
    {
        private IDocument _Document;

        public DocumentController(IDocument Document)
        {
            _Document = Document;
        }


        [HttpGet]
        public IEnumerable<Document> GetDocuments()
        {
            var Document = _Document.GetDocuments();
            return Document;
        }

        [HttpGet]
        public IEnumerable<DocumentMaster> GetMasterDocuments()
        {
            var MasterDocuments = _Document.GetMasterDocuments();
            return MasterDocuments;
        }

        [HttpGet]
        [Route("api/Document/GetDocumentByID/{documentid}")]
        public Document GetDocumentByID(int documentid)
        {
            var Document = _Document.GetDocumentByID(documentid);
            return Document;
        }

        [HttpGet]
        [Route("api/Document/GetDocuments/{projectId}")]
        public IEnumerable<Document> GetDocuments(int projectId)
        {
            return _Document.GetDocuments(projectId);
        }

        [HttpGet]
        [Route("api/Document/GetDocumentName/{documentid}")]
        public string GetDocumentName(string documentid)
        {
            return _Document.GetDocumentName(documentid);
        }

        [HttpGet]
        [Route("api/Document/GetDocumentDetails/{projectId}")]
        public IEnumerable<DocumentLenderModel> GetDocumentDetails(int projectId)
        {
            return _Document.GetDocumentData(projectId);
        }


        public IHttpActionResult PostDocument(Document Document)
        {
            if (!ModelState.IsValid)
                return BadRequest("Invalid data.");
            Task.Run(async () => await _Document.AddDocument(Document));
            return Ok();
        }

        [HttpDelete]
        [Route("api/Document/DeleteDocument/{Documentid}")]
        public IHttpActionResult DeleteDocument(int Documentid)
        {
            if (Documentid > 0 && _Document.DeleteDocument(Documentid).ToString() != "Deletion failed")
                return Ok();
            else
                return BadRequest("Not a valid Project id");
        }

        [HttpDelete]
        [Route("api/Document/DeleteDocument/{projectid}/{documentName}")]
        public IHttpActionResult DeleteDocument(int projectid,string documentName)
        {
            if (projectid > 0 && _Document.DeleteDocument(projectid, documentName).ToString() != "Deletion failed")
                return Ok();
            else
                return BadRequest("Not a valid Project id");
        }


        [HttpPut]
        public IHttpActionResult UpdateDocument(Document Document)
        {
            if (!ModelState.IsValid)
                return BadRequest("Not a valid model");
            Task.Run(async () => await _Document.UpdateDocument(Document));
            return Ok();
        }
    }
}
