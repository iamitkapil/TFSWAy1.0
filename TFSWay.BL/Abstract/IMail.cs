using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using TFSWay.DomainModel.Entities;
using TFSWay.BL.Model;

namespace TFSWay.BL.Abstract
{
    public interface IMail
    {
        IEnumerable<Mail> GetMails();
        Mail GetMails(string stage);
        Task<String> AddMail(Mail mail);
        String SendMail(int projectid, string status, string subject, string body);
        String SendMail(string to, string cc, string bcc, string subject, string attachment, string body,string queryid, string type);
        string SendMail(int projectid);
        string SendManagerChangeMail(int projectId, int oldmanagerID, int newmanagerID);
        string SendReminder(string to, string name, string activity);
        Task<string> SendMailActivityPlan(int projectid, string status, string subject, string body);
    }
}