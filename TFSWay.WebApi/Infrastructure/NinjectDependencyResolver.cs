using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using Ninject;
using System.Web.Mvc;
using TFSWay.DomainModel.Entities;
using TFSWay.DomainModel.Abstract;
using TFSWay.DomainModel.Concrete;
using TFSWay.BL.Abstract;
using TFSWay.BL.Concrete;


namespace TFSWay.WebApi.Infrastructure
{
    public class NinjectDependencyResolver : IDependencyResolver
    {
        private IKernel kernel;
        public NinjectDependencyResolver(IKernel kernelParam)
        {
            kernel = kernelParam;
            AddBindings();
        }
        public object GetService(Type serviceType)
        {
            return kernel.TryGet(serviceType);
        }
        public IEnumerable<object> GetServices(Type serviceType)
        {
            return kernel.GetAll(serviceType);
        }
        private void AddBindings()
        {
            // put bindings here

            //Mock<ICustomerRepository> mock = new Mock<ICustomerRepository>();

            //mock.Setup(m => m.Customers).Returns(new List<Customer> {
            //    new Customer {CustomerId = 1 , CustomerFirstName="Rohan", CustomerLastName="Makhija"}
            //});

            kernel.Bind<ICustomer>().To<TFSWay.BL.Concrete.Customer>();
            kernel.Bind<ICustomerRepository>().To<CustomerRepository>();
            kernel.Bind<IUser>().To<clsUser>();
            kernel.Bind<IUserRepository>().To<UserRepository>();
            kernel.Bind<IClientDetail>().To<ClsClientDetail>();
            kernel.Bind<IClientDetailRepository>().To<ClientDetailRepository>();
            kernel.Bind<IProject>().To<ClsProject>();
            //kernel.Bind<IProjectCompanyDetailRepository>().To<ProjectCompanyDetailRepository>();
            kernel.Bind<IPromoter>().To<clsPromoter>();
            kernel.Bind<IPromoterRepository>().To<PromoterRepository>();
            kernel.Bind<ICostBreakup>().To<clsCostBreakup>();
            kernel.Bind<ICostBreakupRepository>().To<CostBreakupRepository>();
            kernel.Bind<IQuery>().To<ClsQuery>();
            kernel.Bind<IQueryRepository>().To<QueryRepository>();
            kernel.Bind<IReplyRepository>().To<ReplyRepository>();
            kernel.Bind<IQueryRefDocumentRepository>().To<QueryRefDocumentRepository>();
            kernel.Bind<IDirectorRepository>().To<DirectorRepository>();
            kernel.Bind<IDirector>().To<clsDirector>();
            kernel.Bind<IAuthorisedPersonRepository>().To<AuthorisedPersonRepository>();
            kernel.Bind<IAuthorisedPerson>().To<clsAuthorisedPerson>();
            kernel.Bind<IShareholderRepository>().To<ShareholderRepository>();
            kernel.Bind<IShareholder>().To<clsShareholder>();
            kernel.Bind<ILenderRepository>().To<LenderRepository>();
            kernel.Bind<ILenderMasterRepository>().To<LenderMasterRepository>();
            kernel.Bind<ILender>().To<clsLender>();
            kernel.Bind<ITeaserRepository>().To<TeaserRepository>();
            kernel.Bind<ITeaser>().To<clsTeaser>();
            kernel.Bind<IStrategyProposalRepository>().To<StrategyProposalRepository>();
            kernel.Bind<IStrategyProposal>().To<clsStrategyProposal>();
            kernel.Bind<IDocument>().To<ClsDocument>();
            kernel.Bind<IDocumentRepository>().To<DocumentRepository>();
            kernel.Bind<IDocumentMasterRepository>().To<DocumentMasterRepository>();
            kernel.Bind<IProjectPlan>().To<ClsProjectPlan>();
            kernel.Bind<IProjectPlanRepository>().To<ProjectPlanRepository>();

            kernel.Bind<IProjectActivityPlan>().To<clsProjectActivityPlan>();
            kernel.Bind<IProjectActivityPlanRepository>().To<ProjectActivityPlanRepository>();

            kernel.Bind<ITaskTracker>().To<clsTaskTracker>();
            kernel.Bind<ITaskTrackerRepository>().To<TaskTrackerRepository>();
            kernel.Bind<IMail>().To<ClsMail>();
            kernel.Bind<IMailRepository>().To<MailRepository>();
            kernel.Bind<IAgencyRepository>().To<AgencyRepository>();
            kernel.Bind<IAgency>().To<clsAgency>();
            kernel.Bind<IGroupRepository>().To<GroupRepository>();
            kernel.Bind<ICompanyRepository>().To<CompanyRepository>();
            kernel.Bind<IProjectRepository>().To<ProjectRepository>();
            kernel.Bind<IGroup>().To<clsGroup>();

            kernel.Bind<IActivitiesRepository>().To<ActivitiesRepository>();
            kernel.Bind<IActivities>().To<clsActivityTemplate>();


            kernel.Bind<IMOMRepository>().To<MOMRepository>();
            kernel.Bind<IMOM>().To<clsMOM>();

        }
    }
}