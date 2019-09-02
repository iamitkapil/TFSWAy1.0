using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using TFSWay.DomainModel.Abstract;
using TFSWay.DomainModel.Entities;
using System.Data.Entity;

namespace TFSWay.DomainModel.Concrete
{
    public class DocumentRepository : IDocumentRepository
    {

        private TFSWayDBContext db;
        public DocumentRepository()
        {
            db = new Concrete.TFSWayDBContext();
        }

        public IEnumerable<Document> Documents
        {
            get { return db.Documents; }
        }

        public IEnumerable<Document> GetDocuments()
        {
            return this.Documents;

        }

        public Document GetDocumentByID(int documentid)
        {
            Document document = db.Documents.Find(documentid);
            return document;
          
        }

        public async Task<int> AddDocument(Document document)
        {
            db.Documents.Add(document);
            await db.SaveChangesAsync();
            int insertedDocumentid = document.DocumentID;
            return insertedDocumentid;
        }

        public async Task<Document> FetchbyDocumentById(int documentid)
        {
            Document document = await db.Documents.FindAsync(documentid);
            return document;
        }

        public async Task<int> UpdateDocument(Document document)
        {
            Document existingDocument = await FetchbyDocumentById(document.DocumentID);
            db.Entry(existingDocument).State = EntityState.Detached;
            db.Entry(document).State = EntityState.Modified;
            int result = await db.SaveChangesAsync();
            return result;
        }

        public async Task<int> DeleteDocument(int documentid)
        {
            Document document = await FetchbyDocumentById(documentid);
            db.Documents.Remove(document);
            int result = await db.SaveChangesAsync();
            return result;
        }

    }
}

