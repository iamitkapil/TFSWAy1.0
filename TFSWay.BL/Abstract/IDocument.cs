using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using TFSWay.DomainModel.Entities;
using TFSWay.BL.Model;

namespace TFSWay.BL.Abstract
{
    public interface IDocument
    {
        IEnumerable<Document> GetDocuments();
        Document GetDocumentByID(int documentid);
        string GetDocumentName(string documentID);
        string GetDocumentPath(string documentID);
        IEnumerable<Document> GetDocuments(int projectid);
        IEnumerable<DocumentMaster> GetMasterDocuments();
        IEnumerable<DocumentLenderModel> GetDocumentData(int projectid);
        Task<String> AddDocument(Document document);
        Task<String> UpdateDocument(Document document);
        String DeleteDocument(int documentid);
        String DeleteDocument(int projectid,string document);
    }

}
