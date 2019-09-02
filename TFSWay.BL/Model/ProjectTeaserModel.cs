using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using TFSWay.BL.Abstract;
using TFSWay.DomainModel.Entities;
using TFSWay.DomainModel.Abstract;

namespace TFSWay.BL.Model
{
    public class ProjectTeaserModel
    {
        public ProjectTeaserModel(Project project, Company company, Group group,Promoter promoter, Teaser teaser, IList<Director> directors, IList<Shareholder> shareholders)
        {
            ProjectId = project.ProjectId;
            NameoftheCompany = company.CompanyName;
            GroupName = group.GroupName;
            OfficeAddress = company.RegisteredAddress;
            IncorporationDate = project.IncorporationDate;
            CreditCompRating = project.CreditCompRating;
            ProjectName = project.ProjectName;
            Capacity_AC = project.Capacity_AC; //Capacity_AC
                        
            Capacity_DC = project.Capacity_DC;
            PlantLocation = project.PlantLocation;
            Planttype = project.Planttype;
            Technology = project.Technology;
            RequiredLand = project.RequiredLand;
            EPCContractor = project.EPCContractor;
            TermLoan = project.TotalDebt;
            DTDTenure=project.DTDTenure;
            RepaymentPeriod=project.RepaymentPeriod;
            Tariff= project.Tariff;
             
            TotalCost = project.TotalCost;
            OMContractor = project.OMContractor;
            DebtEquityRatio = project.DebtEquityRatio;
            PPADate = project.PPADate;
            SCOD = project.SCOD;
            CUF = project.CUF;
            IRR = project.IRR;
            MinDSCR = project.MinDSCR;
            AvgDSCR = project.AvgDSCR;
            ProjectTariffUnit = project.ProjectTariffUnit;
            ProjectCapacityUnit = project.ProjectCapacityUnit;
            TeaserModel = new Teasermodel(promoter, teaser, directors, shareholders);
        }
        public int ProjectId { get; set; }
        public string NameoftheCompany { get; set; }
        public string GroupName { get; set; }
        public string OfficeAddress { get; set; }
        public DateTime? IncorporationDate { get; set; }
        public string CreditCompRating { get; set; }
        public string ProjectName { get; set; }
        public decimal? Capacity_AC { get; set; } //Capacity_AC
        public decimal? Capacity_DC { get; set; }
        public string PlantLocation { get; set; }
        public string Planttype { get; set; }
        public string Technology { get; set; }
        public decimal? RequiredLand { get; set; }
        public string EPCContractor { get; set; }
        public decimal? TotalCost { get; set; }
        public string OMContractor { get; set; }
        public string DebtEquityRatio { get; set; }
        public DateTime? PPADate { get; set; }
        public DateTime? SCOD { get; set; }
        public decimal? CUF { get; set; }
        public decimal? IRR { get; set; }
        public decimal? MinDSCR { get; set; }
        public decimal? AvgDSCR { get; set; }
        public string DTDTenure { get; set; }
        public decimal? Tariff { get; set; }
        public string RepaymentPeriod { get; set; }
        public decimal? TermLoan { get; set; }
        public string ProjectTariffUnit { get; set; }
        public string ProjectCapacityUnit { get; set; }
        public Teasermodel TeaserModel;

    }

    
    public class Teasermodel
    {
        public Teasermodel(Promoter promoter, Teaser teaser, IList<Director> directors, IList<Shareholder> shareholders)
        {
            Promoter = new PromoterModel(promoter);
            if (teaser != default(Teaser))
            {
                Teaser = teaser;
            }
            Directors = new List<DirectorModel>();
            Shareholders = new List<ShareholderModel>();
            foreach (Director director in directors)
            {
                DirectorModel Director = new DirectorModel(director);
                Directors.Add(Director);
            }

            foreach (Shareholder shareholder in shareholders)
            {
                ShareholderModel Shareholder = new ShareholderModel(shareholder);
                Shareholders.Add(Shareholder);
            }
        }

        public PromoterModel Promoter;
        public Teaser Teaser;
        public IList<DirectorModel> Directors { get; set; }
        public IList<ShareholderModel> Shareholders { get; set; }

    }

    public class PromoterModel
    {
        public PromoterModel(Promoter promoter)
        {
            PromoterId = promoter.PromoterId;
            PromoterName = promoter.Name;

        }
        public int PromoterId { get; set; }
        public string PromoterName { get; set; }
    };

    public class DirectorModel
    {
        public DirectorModel(Director director)
        {
            DirectorId = director.DirectorId;
            DirectorName = director.Name;

        }
        public int DirectorId { get; set; }
        public string DirectorName { get; set; }
    };

    public class ShareholderModel
    {
        public ShareholderModel(Shareholder shareholder)
        {
            ShareHolderId = shareholder.ShareholderId;
            ShareHolderName = shareholder.Name;
            NoofShares = shareholder.Share;
            Facevalue = shareholder.FaceValue;
            Percentage = shareholder.Percentage;
            ShareholderType = shareholder.ShareholderType;
        }

        public int ShareHolderId;
        public string ShareHolderName;
        public string NoofShares;
        public string Facevalue;
        public string Percentage;
        public string ShareholderType;

    }


}
