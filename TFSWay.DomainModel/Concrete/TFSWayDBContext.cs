using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using TFSWay.DomainModel.Entities;
using System.Data.Entity;

namespace TFSWay.DomainModel.Concrete
{
    public class TFSWayDBContext : DbContext
    {
        public TFSWayDBContext() : base("name=TFSWayContext")
        {
            Database.SetInitializer(new MigrateDatabaseToLatestVersion<TFSWayDBContext, TFSWay.DomainModel.Migrations.Configuration>("TFSWayContext"));

        }

        public TFSWayDBContext(string connString) : base(connString)
        {

        }

        //protected override void OnModelCreating(DbModelBuilder modelBuilder)
        //{
        //    // other code 
        //    Database.SetInitializer<TFSWayDBContext>(null);
        //    // more code
        //}

        public DbSet<Customer> Customers { get; set; }
        public DbSet<User> Users { get; set;}
        public DbSet<ClientDetail> ClientDetails { get; set; }     
        public DbSet<Query> Queries { get; set; }
        public DbSet<Reply> Replies { get; set; }
        public DbSet<QueryRefDocument> QueryRefDocuments { get; set; }
        public DbSet<Promoter> Promoters { get; set; }
        public DbSet<CostBreakup> CostBreakups { get; set; }
        public DbSet<Director> Directors { get; set; }
        public DbSet<AuthorisedPerson> AuthorisedPersons { get; set; }
        public DbSet<Shareholder> Shareholders { get; set; }
        public DbSet<Lender> Lenders { get; set; }
        public DbSet<LenderMaster> MasterLenders { get; set; }

        public DbSet<Document> Documents { get; set; }
        public DbSet<DocumentMaster> DocumentMaster { get; set; }
        public DbSet<ProjectPlan> ProjectPlans { get; set; }
        public DbSet<ProjectActivityPlan> ProjectActivityPlans { get; set; }
        public DbSet<ActivityTemplate> ActivityTemplates { get; set; }
        public DbSet<Teaser> Teasers { get; set; }
        public DbSet<Agency> Agencys { get; set; }
        public DbSet<Group> Groups { get; set; }
        public DbSet<Company> Companys { get; set; }
        public DbSet<Project> Projects { get; set; }


        public DbSet<StrategyProposal> StrategyProposals { get; set; }
        public DbSet<TaskTracker> TaskTrackers { get; set; }
        public DbSet<Mail> Mails { get; set; }
        public DbSet<MOM> MOMs { get; set; }



        //protected override void OnModelCreating(DbModelBuilder modelBuilder)
        //{

        //    base.OnModelCreating(modelBuilder);
        //}

    }
}
