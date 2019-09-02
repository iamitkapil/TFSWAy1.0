using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using TFSWay.DomainModel.Entities;

namespace TFSWay.DomainModel.Abstract
{
   public interface IDocumentMasterRepository
    {

        IEnumerable<DocumentMaster> MasterDocuments { get; }
        IEnumerable<DocumentMaster> GetMasterDocuments();
        Task<DocumentMaster> GetMasterDocumentByID(int documentid);
        Task<int> AddMasterDocument(DocumentMaster document);
        Task<int> UpdateMasterDocument(DocumentMaster document);
        Task<int> DeleteMasterDocument(int documentsid);

    }
}
