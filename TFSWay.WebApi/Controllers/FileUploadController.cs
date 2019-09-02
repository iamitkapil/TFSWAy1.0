using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Web;
using System.Net.Http;
using System.Web.Http;

namespace TFSWay.WebApi.Controllers
{
    public class FileUploadController : ApiController
    {
        [HttpPost]
        public string UploadJsonFile()
        {
            string FileUploadpath = System.Configuration.ConfigurationManager.AppSettings["FileUploadpath"];

            var filePath = "";
            HttpResponseMessage response = new HttpResponseMessage();
            var httpRequest = HttpContext.Current.Request;
            if (httpRequest.Files.Count > 0)
            {
                foreach (string file in httpRequest.Files)
                {
                    var postedFile = httpRequest.Files[file];
                    filePath = FileUploadpath + postedFile.FileName;
                    postedFile.SaveAs(filePath);
                }
            }
            return filePath;
        }
    }
}