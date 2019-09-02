using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using TFSWay.DomainModel.Entities;

namespace TFSWay.DomainModel.Abstract
{
    public interface IQueryRefDocumentRepository
    {

        IEnumerable<QueryRefDocument> QueryRefDocuments { get; }
        IEnumerable<QueryRefDocument> GetQueryRefDocuments();
        List<QueryRefDocument> GetQueryRefDocumentList();
        Task<int> AddQueryRefDocument(QueryRefDocument queryrefdocument);
        Task<int> UpdateQueryRefDocument(QueryRefDocument queryrefdocument);
        //Task<int> DeleteQueryRefDocument(int id);
        //Task<int> DeleteQueryRefDocumentsbyQueryId(int id);

    }
}