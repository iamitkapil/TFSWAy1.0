using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using TFSWay.BL.Abstract;
using TFSWay.DomainModel.Entities;
using TFSWay.DomainModel.Abstract;
using TFSWay.BL.Model;
using System.Net.Mail;
using TFSWay.BL.Extensions;
using System.Text.RegularExpressions;

namespace TFSWay.BL.Concrete
{
    public class ClsMail : IMail
    {
        private IMailRepository MailRepository;
        private IProjectRepository ProjectRepository;
        private IDocument Document;
        private IUserRepository UserRepository;
        private IProject Project;
        private IQuery Query;
        private IMOM MOM;
        public ClsMail(IQuery query, IDocument document, IMailRepository mailrepository, IProjectRepository projectrepository, IUserRepository userrepository, IProject project, IMOM mom)
        {
            this.MailRepository = mailrepository;
            this.ProjectRepository = projectrepository;
            this.UserRepository = userrepository;
            this.Project = project;
            this.Document = document;
            this.Query = query;
            this.MOM = mom;
        }


        public IEnumerable<Mail> GetMails()
        {
            var mails = MailRepository.GetMails();
            return mails;
        }


        public string ReplaceKeywords(string str, string keywords, List<KeyValuePair<string, string>> list)
        {

            List<string> Keys = keywords.Split(',').ToList();

            foreach (string s in Keys)
            {
                foreach (KeyValuePair<string, string> element in list)
                {
                    if (s == element.Key)
                        str = str.Replace(s, element.Value);
                }

            }

            return str;

        }

        public string SendMail(int projectid)
        {
            string mailSent = "";
            if (projectid == 0)
                projectid = Project.GetLastProjectID();

            Project projectcompanydetail = ProjectRepository.Projects.FirstOrDefault(c => c.ProjectId == projectid);
            if (projectcompanydetail.Status != "On Going" && projectcompanydetail.Status != "Completed")
            {
                User authorisedperson = UserRepository.GetUsers().SingleOrDefault(c => c.UserID == projectcompanydetail.ProjectManagerId);
                User supervisor = UserRepository.GetUsers().SingleOrDefault(c => c.UserID == projectcompanydetail.SupervisorId);
                Mail mail = GetMails(projectcompanydetail.Status);

                string MailTo = authorisedperson.Email;
                string MailBCC = supervisor.Email;
                string MailSubject = mail.Subject;
                string MailBody = mail.Body;

                var list = new List<KeyValuePair<string, string>>() {
                new KeyValuePair<string, string>("{prjectManager}", authorisedperson.FirstName),
                new KeyValuePair<string, string>("{clientName}", projectcompanydetail.ProjectName),
                  new KeyValuePair<string, string>("{reason}", projectcompanydetail.Reason),
                new KeyValuePair<string, string>("{startdate}", Convert.ToDateTime(projectcompanydetail.ProjectStartDate).ToShortDateString()),
                new KeyValuePair<string, string>("{enddate}", Convert.ToDateTime(projectcompanydetail.ProjectEndDate).ToShortDateString())
                    };

                MailSubject = ReplaceKeywords(MailSubject, mail.KeyWord, list);
                MailBody = ReplaceKeywords(MailBody, mail.KeyWord, list);

                string SMTPServer = System.Configuration.ConfigurationManager.AppSettings["SMTPServer"];
                int SMTPPort = Convert.ToInt32(System.Configuration.ConfigurationManager.AppSettings["SMTPPort"].ToString());
                string MailUserID = System.Configuration.ConfigurationManager.AppSettings["MailUserID"];
                string MailPassword = System.Configuration.ConfigurationManager.AppSettings["MailPassword"];


                try
                {
                    SmtpClient SmtpServer = new SmtpClient(SMTPServer);

                    MailMessage mailmessage = new MailMessage();
                    mailmessage.From = new MailAddress(MailUserID);
                    mailmessage.To.Add(MailTo);
                    if (MailBCC != "")
                        mailmessage.Bcc.Add(MailBCC);
                    mailmessage.Subject = MailSubject;
                    mailmessage.Body = MailBody;
                    mailmessage.IsBodyHtml = true;
                    SmtpServer.Port = SMTPPort;
                    SmtpServer.DeliveryMethod = SmtpDeliveryMethod.Network;
                    SmtpServer.UseDefaultCredentials = false;
                    SmtpServer.Credentials = new System.Net.NetworkCredential(MailUserID, MailPassword);
                    SmtpServer.EnableSsl = true;
                    SmtpServer.Send(mailmessage);
                    mailSent = "Mail Sent";
                }
                catch (Exception e)
                {
                    mailSent = "Mail Send failed";
                }
            }
            return mailSent;
        }

        public string SendManagerChangeMail(int projectid, int oldProjectMangerID, int newProjectManagerID)
        {
            string mailSent = "";
            string Salutation = "";
            if (projectid == 0)
                projectid = Project.GetLastProjectID();

            Project projectcompanydetail = ProjectRepository.Projects.FirstOrDefault(c => c.ProjectId == projectid);
            User oldManager = UserRepository.GetUsers().SingleOrDefault(c => c.UserID == oldProjectMangerID);
            User supervisor = UserRepository.GetUsers().SingleOrDefault(c => c.UserID == projectcompanydetail.SupervisorId);
            User newManager = UserRepository.GetUsers().SingleOrDefault(c => c.UserID == newProjectManagerID);

            string MailTo = "";
            string MailCC = "";
            string MailSubject = "";
            string MailBody = "";
            // Send mail to old Manager for Relieving 
            MailTo = oldManager.Email;
            Salutation = "Hi " + oldManager.FirstName + ",<br/><br/>";
            MailCC = supervisor.Email;

            MailSubject = "Relieving from Project Assignment : " + projectcompanydetail.ProjectName;
            MailBody = "You are relieved from the following project: <br/>" + projectcompanydetail.ProjectName;

            string signature = "<br/><br/> TFS Management Team";

            MailBody = Salutation + MailBody + "<br/><br/><br/>" + signature;
            string SMTPServer = System.Configuration.ConfigurationManager.AppSettings["SMTPServer"];
            int SMTPPort = Convert.ToInt32(System.Configuration.ConfigurationManager.AppSettings["SMTPPort"].ToString());
            string MailUserID = System.Configuration.ConfigurationManager.AppSettings["MailUserID"];
            string MailPassword = System.Configuration.ConfigurationManager.AppSettings["MailPassword"];


            try
            {

                SmtpClient SmtpServer = new SmtpClient(SMTPServer);
                MailMessage mailmessage = new MailMessage();

                mailmessage.From = new MailAddress(MailUserID);
                mailmessage.To.Add(MailTo);

                if (MailCC != "NA")
                    mailmessage.CC.Add(MailCC);

                mailmessage.Subject = MailSubject;
                mailmessage.Body = MailBody;
                mailmessage.IsBodyHtml = true;


                SmtpServer.Port = SMTPPort;
                SmtpServer.DeliveryMethod = SmtpDeliveryMethod.Network;
                SmtpServer.UseDefaultCredentials = false;
                SmtpServer.Credentials = new System.Net.NetworkCredential(MailUserID, MailPassword);
                SmtpServer.EnableSsl = true;
                SmtpServer.Send(mailmessage);
                mailSent = "Mail Sent";
            }
            catch (Exception e)
            {
                mailSent = "Mail Send failed";
            }


            // Send mail to New Manager for Assigning 
            MailTo = newManager.Email;
            Salutation = "Hi " + newManager.FirstName + ",<br/><br/>";
            MailCC = supervisor.Email;

            MailSubject = "New Project Assignment : " + projectcompanydetail.ProjectName;
            MailBody = "Congrats! You are assigned on new project with following details.<br/><br/><table border = '1' bordercolor = 'black' bordercollapse = 'collapse' style ='border-collapse:collapse;'><tr><td><b>Client Name</b></td><td><b>" +
      "Start Date</b></td><td><b>End Date</b></td></tr><tr><td>" + projectcompanydetail.ProjectName + "</td><td>" + projectcompanydetail.ProjectStartDate.Value.ToShortDateString() + "</td><td>" + projectcompanydetail.ProjectEndDate.Value.ToShortDateString() +
      "</td></tr></table><br/><br/><br/>Best wishes for new project.<br/> TFS Management Team";


            MailBody = Salutation + MailBody;

            try
            {

                SmtpClient SmtpServer = new SmtpClient(SMTPServer);
                MailMessage mailmessage = new MailMessage();

                mailmessage.From = new MailAddress(MailUserID);
                mailmessage.To.Add(MailTo);

                if (MailCC != "NA")
                    mailmessage.CC.Add(MailCC);

                mailmessage.Subject = MailSubject;
                mailmessage.Body = MailBody;
                mailmessage.IsBodyHtml = true;


                SmtpServer.Port = SMTPPort;
                SmtpServer.DeliveryMethod = SmtpDeliveryMethod.Network;
                SmtpServer.UseDefaultCredentials = false;
                SmtpServer.Credentials = new System.Net.NetworkCredential(MailUserID, MailPassword);
                SmtpServer.EnableSsl = true;
                SmtpServer.Send(mailmessage);
                mailSent = "Mail Sent";
            }
            catch (Exception e)
            {
                mailSent = "Mail Send failed";
            }

            return mailSent;
        }
        public async Task<string> SendMailActivityPlan(int projectid, string status, string subject, string body)
        {
            string mailSent = "";
            string Salutation = "";
            if (projectid == 0)
                projectid = Project.GetLastProjectID();

            Project projectcompanydetail = ProjectRepository.Projects.FirstOrDefault(c => c.ProjectId == projectid);
            User authorisedperson = UserRepository.GetUsers().SingleOrDefault(c => c.UserID == projectcompanydetail.ProjectManagerId);
            User supervisor = UserRepository.GetUsers().SingleOrDefault(c => c.UserID == projectcompanydetail.SupervisorId);
            //User management = UserRepository.GetUsers().SingleOrDefault(c => c.Designation == "Admin");
            IEnumerable<User> userList = new List<User>();
            userList = UserRepository.Users.Where(c => c.Designation == "Admin");

            string MailTo = "";

            if (status == "Submitted" || status == "Created" || status == "Delay")
            {
                foreach (User user in userList)
                {
                    if (MailTo != "")
                        MailTo = MailTo + "," + user.Email;
                    else
                        MailTo = user.Email;
                }
                Salutation = "Hi Management ,<br/><br/>";
            }
            else
            {
                MailTo = authorisedperson.Email;
                Salutation = "Hi " + authorisedperson.FirstName + ",<br/><br/>";
            }
            string MailCC = supervisor.Email;
            //string MailBCC = bcc;
            string MailSubject = projectcompanydetail.ProjectName + " : " + subject;
            string MailBody = body.Replace("<ProjectName>", projectcompanydetail.ProjectName);


            string signature = "&nbsp;<br/><br/> TFS Management Team";

            MailBody = Salutation + MailBody + "<br/><br/><br/>" + signature;
            string SMTPServer = System.Configuration.ConfigurationManager.AppSettings["SMTPServer"];
            int SMTPPort = Convert.ToInt32(System.Configuration.ConfigurationManager.AppSettings["SMTPPort"].ToString());
            string MailUserID = System.Configuration.ConfigurationManager.AppSettings["MailUserID"];
            string MailPassword = System.Configuration.ConfigurationManager.AppSettings["MailPassword"];


            try
            {

                SmtpClient SmtpServer = new SmtpClient(SMTPServer);
                MailMessage mailmessage = new MailMessage();

                mailmessage.From = new MailAddress(MailUserID);
                mailmessage.To.Add(MailTo);

                if (MailCC != "NA")
                    mailmessage.CC.Add(MailCC);

                mailmessage.Subject = MailSubject;
                mailmessage.Body = MailBody;
                mailmessage.IsBodyHtml = true;


                SmtpServer.Port = SMTPPort;
                SmtpServer.DeliveryMethod = SmtpDeliveryMethod.Network;
                SmtpServer.UseDefaultCredentials = false;
                SmtpServer.Credentials = new System.Net.NetworkCredential(MailUserID, MailPassword);
                SmtpServer.EnableSsl = true;
                SmtpServer.Send(mailmessage);
                mailSent = "Mail Sent";
            }
            catch (Exception e)
            {
                mailSent = "Mail Send failed";
            }

            return await Task.FromResult(mailSent); ;
        }
        public string SendMail(int projectid, string status, string subject, string body)
        {
            string mailSent = "";
            string Salutation = "";
            if (projectid == 0)
                projectid = Project.GetLastProjectID();

            Project projectcompanydetail = ProjectRepository.Projects.FirstOrDefault(c => c.ProjectId == projectid);
            User authorisedperson = UserRepository.GetUsers().SingleOrDefault(c => c.UserID == projectcompanydetail.ProjectManagerId);
            User supervisor = UserRepository.GetUsers().SingleOrDefault(c => c.UserID == projectcompanydetail.SupervisorId);
            //User management = UserRepository.GetUsers().SingleOrDefault(c => c.Designation == "Admin");
            IEnumerable<User> userList = new List<User>();
            userList = UserRepository.Users.Where(c => c.Designation == "Admin");

            string MailTo = "";

            if (status == "Submitted" || status == "Created" || status == "Delay")
            {
                foreach (User user in userList)
                {
                    if (MailTo != "")
                        MailTo = MailTo + "," + user.Email;
                    else
                        MailTo = user.Email;
                }
                Salutation = "Hi Management ,<br/><br/>";
            }
            else
            {
                MailTo = authorisedperson.Email;
                Salutation = "Hi " + authorisedperson.FirstName + ",<br/><br/>";
            }
            string MailCC = supervisor.Email;
            //string MailBCC = bcc;
            string MailSubject = projectcompanydetail.ProjectName + " : " + subject;
            string MailBody = body.Replace("<ProjectName>", projectcompanydetail.ProjectName);


            string signature = "&nbsp;<br/><br/> TFS Management Team";

            MailBody = Salutation + MailBody + "<br/><br/><br/>" + signature;
            string SMTPServer = System.Configuration.ConfigurationManager.AppSettings["SMTPServer"];
            int SMTPPort = Convert.ToInt32(System.Configuration.ConfigurationManager.AppSettings["SMTPPort"].ToString());
            string MailUserID = System.Configuration.ConfigurationManager.AppSettings["MailUserID"];
            string MailPassword = System.Configuration.ConfigurationManager.AppSettings["MailPassword"];


            try
            {

                SmtpClient SmtpServer = new SmtpClient(SMTPServer);
                MailMessage mailmessage = new MailMessage();

                mailmessage.From = new MailAddress(MailUserID);
                mailmessage.To.Add(MailTo);

                if (MailCC != "NA")
                    mailmessage.CC.Add(MailCC);

                mailmessage.Subject = MailSubject;
                mailmessage.Body = MailBody;
                mailmessage.IsBodyHtml = true;


                SmtpServer.Port = SMTPPort;
                SmtpServer.DeliveryMethod = SmtpDeliveryMethod.Network;
                SmtpServer.UseDefaultCredentials = false;
                SmtpServer.Credentials = new System.Net.NetworkCredential(MailUserID, MailPassword);
                SmtpServer.EnableSsl = true;
                SmtpServer.Send(mailmessage);
                mailSent = "Mail Sent";
            }
            catch (Exception e)
            {
                mailSent = "Mail Send failed";
            }

            return mailSent;
        }
        public string SendMail(string to, string cc, string bcc, string subject, string attachment, string body, string queryid, string type)
        {
            string MailTo = to;
            string MailCC = cc;
            string MailBCC = bcc;
            string MailSubject = subject;
            string MailBody = body.Replace("{br}", "<br/>").Replace("{.}", ".");
            string MailAttachment = attachment;
            string QueryMailBody = "";
            string MOMMailBody = "";
            string signature = "&nbsp;<br/><br/> TFS Management Team";

            if (type == "Query")
            {
                QueryMailBody = Query.GeQueryMailBody(queryid);
                MailBody = MailBody + "<br/>" + QueryMailBody + signature;
            }
            if (type == "Document")
            {
                string DocMailBody = "";
                DocMailBody = "Please find the attached documents.";
                MailBody = MailBody + "<br/>" + DocMailBody + signature;
            }
            if (type == "MOM")
            {
                MOMMailBody = MOM.GeMOMMailBody(queryid);
                MailBody = MailBody + "<br/>" + MOMMailBody + signature;
            }


            string mailSent = "";
            string SMTPServer = System.Configuration.ConfigurationManager.AppSettings["SMTPServer"];
            int SMTPPort = Convert.ToInt32(System.Configuration.ConfigurationManager.AppSettings["SMTPPort"].ToString());
            string MailUserID = System.Configuration.ConfigurationManager.AppSettings["MailUserID"];
            string MailPassword = System.Configuration.ConfigurationManager.AppSettings["MailPassword"];


            try
            {

                SmtpClient SmtpServer = new SmtpClient(SMTPServer);
                MailMessage mailmessage = new MailMessage();

                if (MailAttachment != "NA")
                {

                    MailAttachment = MailAttachment.TrimEnd(',');
                    MailAttachment = MailAttachment.TrimStart(',');
                    MailAttachment = MailAttachment.Replace(",,", ",");


                    MailAttachment = Document.GetDocumentPath(MailAttachment);
                    List<string> pathList = MailAttachment.Split(',').ToList<string>();

                    foreach (var path in pathList)
                    {
                        System.Net.WebClient WC = new System.Net.WebClient();
                        string FileName = System.IO.Path.GetFileName(path);

                        var stream = WC.OpenRead(path);
                        Attachment attachements = new Attachment(stream, FileName);
                        mailmessage.Attachments.Add(attachements);
                    }
                }


                mailmessage.From = new MailAddress(MailUserID);
                mailmessage.To.Add(MailTo);
                if (MailBCC != "NA")
                    mailmessage.Bcc.Add(MailBCC);

                if (MailCC != "NA")
                    mailmessage.CC.Add(MailCC);

                mailmessage.Subject = MailSubject;
                mailmessage.Body = MailBody;
                mailmessage.IsBodyHtml = true;


                SmtpServer.Port = SMTPPort;
                SmtpServer.DeliveryMethod = SmtpDeliveryMethod.Network;
                SmtpServer.UseDefaultCredentials = false;
                SmtpServer.Credentials = new System.Net.NetworkCredential(MailUserID, MailPassword);
                SmtpServer.EnableSsl = true;
                SmtpServer.Send(mailmessage);
                mailSent = "Mail Sent";
            }
            catch (Exception e)
            {
                mailSent = "Mail Send failed";
            }

            return mailSent;
        }
        public string SendReminder(string to, string name, string activity)
        {

            string MailTo = to;
            string MailBCC = "";// Supervisor Email ID
            string MailSubject = "Delay in Task Completion";
            string MailBody = "<br/>Dear {prjectManager}<br/><br/><br/>Following task is delayed to complete as per plan.<br/><br/>{activites}<br/><br/><br/>Thanks<br/> TFS Management Team";

            var list = new List<KeyValuePair<string, string>>() {
                new KeyValuePair<string, string>("{prjectManager}", name),
                new KeyValuePair<string, string>("{activites}", activity)
                    };


            MailBody = ReplaceKeywords(MailBody, "{prjectManager},{activites}", list);

            string mailSent = "";
            string SMTPServer = System.Configuration.ConfigurationManager.AppSettings["SMTPServer"];
            int SMTPPort = Convert.ToInt32(System.Configuration.ConfigurationManager.AppSettings["SMTPPort"].ToString());
            string MailUserID = System.Configuration.ConfigurationManager.AppSettings["MailUserID"];
            string MailPassword = System.Configuration.ConfigurationManager.AppSettings["MailPassword"];


            try
            {
                SmtpClient SmtpServer = new SmtpClient(SMTPServer);
                MailMessage mailmessage = new MailMessage();
                mailmessage.From = new MailAddress(MailUserID);
                mailmessage.To.Add(MailTo);
                if (MailBCC != "")
                    mailmessage.Bcc.Add(MailBCC);
                mailmessage.Subject = MailSubject;
                mailmessage.Body = MailBody;
                mailmessage.IsBodyHtml = true;
                SmtpServer.Port = SMTPPort;
                SmtpServer.DeliveryMethod = SmtpDeliveryMethod.Network;
                SmtpServer.UseDefaultCredentials = false;
                SmtpServer.Credentials = new System.Net.NetworkCredential(MailUserID, MailPassword);
                SmtpServer.EnableSsl = true;
                SmtpServer.Send(mailmessage);
                mailSent = "Mail Sent";
            }
            catch (Exception e)
            {
                mailSent = "Mail Send failed";
            }

            return mailSent;
        }
        public Mail GetMails(string stage)
        {
            Mail mail = new Mail();
            mail = GetMails().FirstOrDefault(c => c.Stage == stage);
            return mail;
        }

        public async Task<string> AddMail(Mail mail)
        {
            DateTime now = DateTime.Now;
            int insertedmailid = await MailRepository.AddMail(new Mail { Stage = mail.Stage, Body = mail.Body, Subject = mail.Subject, KeyWord = mail.KeyWord, CreatedDate = now, CreatedBy = mail.CreatedBy });
            return insertedmailid != 0 ? "Successfully Insertion of mail record" : "Insertion failed";
        }
    }
}
