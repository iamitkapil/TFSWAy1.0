using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Web;
using System.Net.Http;
using System.Web.Http;
using System.Net.Mail;
using TFSWay.BL.Abstract;
using TFSWay.DomainModel.Entities;
using TFSWay.BL.Model;
using System.Threading.Tasks;


namespace TFSWay.WebApi.Controllers
{


    public class SendMailController : ApiController
    {
        private IMail _mail;

        public SendMailController(IMail mail)
        {
            _mail = mail;
        }


        [HttpGet]
        public IEnumerable<Mail> GetMails()
        {
            var mail = _mail.GetMails();
            return mail;
        }

        [HttpGet]
        [Route("api/SendMail/GetMailDetail/{stage}")]
        public Mail GetMailDetail(string stage)
        {
            var mail = _mail.GetMails(stage);
            return mail;
        }

        [HttpGet]
        [Route("api/SendMail/SendReminder/{to}/{name}/{activity}")]
        public string SendReminder(string to, string name, string activity)
        {
            return _mail.SendReminder(to, name, activity);
        }

        [HttpGet]
        [Route("api/SendMail/MailSend/{to}/{cc}/{bcc}/{subject}/{attachment}/{body}/{queryid}/{type}")]
        public string MailSend(string to,string cc,string bcc,string subject,string attachment,string body,string queryid, string type)
        {
            if (!ModelState.IsValid)
                return "Invalid data.";
            var str = _mail.SendMail(to,cc,bcc,subject, attachment, body, queryid, type);
            return str;
        }

        [HttpGet]
        [Route("api/SendMail/SendMail/{projectId}")]
        public string SendMail(int projectId)
        {
            return _mail.SendMail(projectId);
        }

        [HttpGet]
        [Route("api/SendMail/SendManagerChangeMail/{projectId}/{oldmanagerID}/{newmanagerID}")]
        public string SendManagerChangeMail(int projectId, int oldmanagerID, int newmanagerID)
        {
            return _mail.SendManagerChangeMail(projectId,oldmanagerID,newmanagerID);
        }

        public IHttpActionResult PostMail(Mail mail)
        {
            if (!ModelState.IsValid)
                return BadRequest("Invalid data.");
            Task.Run(async () => await _mail.AddMail(mail));
            return Ok();
        }
    }
}