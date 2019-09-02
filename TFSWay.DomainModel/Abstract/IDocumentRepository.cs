using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using TFSWay.DomainModel.Entities;

namespace TFSWay.DomainModel.Abstract
{
    public interface IDocumentRepository
    {

        IEnumerable<Document> Documents { get; }
        IEnumerable<Document> GetDocuments();
        Document GetDocumentByID(int documentid);
        Task<int> AddDocument(Document document);
        Task<int> UpdateDocument(Document document);
        Task<int> DeleteDocument(int documentsid);

    }
}