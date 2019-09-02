using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using TFSWay.DomainModel.Abstract;
using TFSWay.DomainModel.Entities;

namespace TFSWay.DomainModel.Concrete
{
   public class DocumentMasterRepository:IDocumentMasterRepository
    {
        private TFSWayDBContext db;
        public DocumentMasterRepository()
        {
            db = new Concrete.TFSWayDBContext();
        }

        public IEnumerable<DocumentMaster> MasterDocuments
        {
            get { return db.DocumentMaster; }
        }

        public IEnumerable<DocumentMaster> GetMasterDocuments()
        {
            return this.MasterDocuments;

        }

        public async Task<DocumentMaster> GetMasterDocumentByID(int id)
        {
            DocumentMaster DocumentMaster = await db.DocumentMaster.FindAsync(id);
            return DocumentMaster;
        }

        public async Task<int> AddMasterDocument(DocumentMaster documentmaster)
        {
            db.DocumentMaster.Add(documentmaster);
            int result = await db.SaveChangesAsync();
            return result;
        }

        public async Task<int> UpdateMasterDocument(DocumentMaster documentmaster)
        {
            DocumentMaster document = await GetMasterDocumentByID(documentmaster.DocumentMasterId);
            db.Entry(document).State = EntityState.Detached;
            db.Entry(document).State = EntityState.Modified;
            int result = await db.SaveChangesAsync();
            return result;
        }

        public async Task<int> DeleteMasterDocument(int id)
        {
            DocumentMaster document = await GetMasterDocumentByID(id);
            db.DocumentMaster.Remove(document);
            int result = await db.SaveChangesAsync();
            return result;
        }

    }
}
