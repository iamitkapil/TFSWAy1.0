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
    public class MailRepository : IMailRepository
    {

        private TFSWayDBContext db;
        public MailRepository()
        {
            db = new Concrete.TFSWayDBContext();
        }

        public IEnumerable<Mail> Mails
        {
            get { return db.Mails; }
        }

        public IEnumerable<Mail> GetMails()
        {
            return this.Mails;

        }

        public async Task<Mail> FetchbyReplyId(int mailid)
        {
            Mail mail = await db.Mails.FindAsync(mailid);
            return mail;
        }

        public async Task<int> AddMail(Mail mail)
        {
            db.Mails.Add(mail);
            int result = await db.SaveChangesAsync();
            return result;
        }

    }
}

