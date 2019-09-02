using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using TFSWay.BL.Abstract;
using TFSWay.DomainModel.Entities;
using TFSWay.DomainModel.Abstract;
using TFSWay.BL.Model;
using TFSWay.BL.Extensions;
using System.Configuration;

namespace TFSWay.BL.Concrete
{
    public class ClsDocument : IDocument
    {
        private IDocumentRepository DocumentRepository;
        private ILenderRepository LenderRepository;
        private IProjectRepository ProjectRepository;
        private ILenderMasterRepository LenderMasterRepository;
        private IDocumentMasterRepository DocumentMasterRepository;

        public ClsDocument(IProjectRepository projectrepository, IDocumentRepository documentrepository,
            ILenderRepository lenderrepository, ILenderMasterRepository lendermasterrepository,
            IDocumentMasterRepository documentmasterrepository)
        {
            this.DocumentRepository = documentrepository;
            this.LenderRepository = lenderrepository;
            this.LenderMasterRepository = lendermasterrepository;
            this.ProjectRepository = projectrepository;
            this.DocumentMasterRepository = documentmasterrepository;
        }

        public IEnumerable<Document> GetDocuments()
        {
            var documents = DocumentRepository.GetDocuments();
            return documents;
        }

        public IEnumerable<DocumentMaster> GetMasterDocuments()
        {
            var documents = DocumentMasterRepository.MasterDocuments.OrderBy(md => md.Stage);
            return documents;
        }

        public Document GetDocumentByID(int documentid)
        {
            var documents = DocumentRepository.GetDocumentByID(documentid);
            return documents;
        }

        public IEnumerable<Document> GetDocuments(int projectid)
        {

            List<DocumentLenderModel> DocumentLenderlist = new List<DocumentLenderModel>();
            List<int> grouplist = new List<int>();

            List<LenderModel> lendermodellist = new List<LenderModel>();

            IEnumerable<Project> project = ProjectRepository.GetProjects().Where(c => c.ProjectId == projectid);


            foreach (var prj in project)
            {
                grouplist.Add(prj.GroupId);
            }

            IEnumerable<Document> documentlist = new List<Document>();
            //documentlist = GetDocuments().Where(c => ((c.FilePath != "") && ((c.DocumnetType == "Template") || (c.ProjectID == projectid) || (c.IsMaster == "True" && grouplist.Contains(c.GroupID)))));
            documentlist = GetDocuments().Where(c => ((c.FilePath != "http://tfsapp1.westindia.cloudapp.azure.com/TfsWebApi/UploadFile/") && ((c.ProjectID == projectid) || (c.IsMaster == "True" && grouplist.Contains(c.GroupID)))));


            return documentlist;
        }

        public string GetDocumentName(string documentID)
        {
            string DocName = "";
            if (documentID != "NA")
            {
                List<string> doclist = documentID.Split(',').ToList();

                IEnumerable<Document> documentlist = new List<Document>();
                documentlist = GetDocuments().Where(c => doclist.Contains(c.DocumentID.ToString()));

                foreach (var doc in documentlist)
                {
                    if (DocName == "")
                        DocName = System.IO.Path.GetFileName(doc.FilePath);
                    else
                        DocName = DocName + "," + System.IO.Path.GetFileName(doc.FilePath);
                }
            }

            return DocName;
        }

        public string GetDocumentPath(string documentID)
        {
            string DocPath = "";
            List<int> doclist = documentID.Split(',').Select(int.Parse).ToList();

            IEnumerable<Document> documentlist = new List<Document>();
            documentlist = GetDocuments().Where(c => doclist.Contains(c.DocumentID));

            foreach (var doc in documentlist)
            {
                if (DocPath == "")
                    DocPath = doc.FilePath;
                else
                    DocPath = DocPath + "," + doc.FilePath;
            }

            return DocPath;
        }

        public IEnumerable<DocumentLenderModel> GetDocumentData(int projectid)
        {
            List<DocumentLenderModel> DocumentLenderlist = new List<DocumentLenderModel>();
            List<int> grouplist = new List<int>();

            List<LenderModel> lendermodellist = new List<LenderModel>();

            IEnumerable<Project> project = ProjectRepository.GetProjects().Where(c => c.ProjectId == projectid);


            foreach (var prj in project)
            {
                grouplist.Add(prj.GroupId);
            }

            IEnumerable<Document> documentlist = new List<Document>();
            documentlist = GetDocuments().Where(c => (c.ProjectID == projectid) || (c.IsMaster == "True" && grouplist.Contains(c.GroupID)));

            foreach (Document document in documentlist)
            {
                //LenderMaster lendermaster;
                //string lenName = "";
                //string lenAddress = "";
                //if (document.LenderID > 0)
                //{
                //    //var len = LenderRepository.GetLenders().SingleOrDefault(c => c.LenderId == document.LenderID);
                //    lendermaster = LenderMasterRepository.GetMasterLenders().SingleOrDefault(c => c.LenderMasterId == document.LenderID);
                //    lenName = lendermaster.LenderName;
                //    lenAddress = lendermaster.LenderAddress;
                //}
                DocumentLenderlist.Add(new DocumentLenderModel
                {
                    DocumentID = document.DocumentID,
                    ProjectID = document.ProjectID,
                    //LenderID = document.LenderID,
                    DocumentName = document.DocumentName,
                    FilePath = document.FilePath,
                    DocumnetType = document.DocumnetType,
                    Stage = document.Stage,
                    //IsAvailable = document.IsAvailable,
                    Completed = document.Completed,
                    IsMaster = document.IsMaster
                    //LenderName = lenName,
                    //LenderAddress = lenAddress


                });


            }
            return DocumentLenderlist;
        }


        public async Task<string> AddDocument(Document document)
        {
            int insertedmasterdocumentid = 0;
            string filePath = ConfigurationManager.AppSettings["FilePath"];
            filePath = filePath + document.FilePath;
            int inserteddocumentid = await DocumentRepository.AddDocument(new Document { ProjectID = document.ProjectID, GroupID = document.GroupID, DocumentName = document.DocumentName, DocumnetType = document.DocumnetType, FilePath = filePath, Stage = document.Stage, IsAvailable = document.IsAvailable, Completed = document.Completed, IsMaster = document.IsMaster, CreatedDate = document.CreatedDate, CreatedBy = document.CreatedBy });

            if (document.IsMaster == "True")
                insertedmasterdocumentid = await DocumentMasterRepository.AddMasterDocument(new DocumentMaster { Stage = document.Stage, Document = document.DocumentName });

            return inserteddocumentid != 0 ? "Successfully Insertion of document record" : "Insertion failed";



        }

        public async Task<string> UpdateDocument(Document documents)
        {

            Document document = DocumentRepository.GetDocuments().FirstOrDefault(c => c.DocumentID == documents.DocumentID);

            if (document == default(Document))
                return "document doen't exist";
            else
            {
                document.DocumentName = documents.DocumentName;
                document.FilePath = documents.FilePath;
                document.Completed = documents.Completed;
                document.Stage = documents.Stage;
                document.IsMaster = documents.IsMaster;
                document.IsAvailable = documents.IsAvailable;
            }

            int updatedocument = await DocumentRepository.UpdateDocument(document);

            return updatedocument == 0 ? "Successfully updated document and reply record" : "Updation failed";

        }
        public string DeleteDocument(int documentid)
        {
            Document document = DocumentRepository.GetDocuments().SingleOrDefault(c => c.DocumentID == documentid);

            int deletedocument = Task.Run<int>(async () => await DocumentRepository.DeleteDocument(documentid)).Result;
            return deletedocument > 0 ? "Successfully Deleted document and reply record" : "Deletion failed";
        }

        public string DeleteDocument(int projectid, string doc)
        {
            Document document = DocumentRepository.GetDocuments().SingleOrDefault(c => c.ProjectID == projectid && c.DocumentName == doc);
            int deletedocument = Task.Run<int>(async () => await DocumentRepository.DeleteDocument(document.DocumentID)).Result;
            return deletedocument > 0 ? "Successfully Deleted document and reply record" : "Deletion failed";
        }
    }
}
