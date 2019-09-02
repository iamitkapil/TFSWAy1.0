using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.ComponentModel;
using System.ComponentModel.DataAnnotations;

namespace TFSWay.DomainModel.Entities
{
   public class ClientDetail
    {
      [Key]
      public int ClientID { get; set; }
      public int ProjectID   { get; set; }
      public string  Name    { get; set; }
      public string  Designation { get; set; }
      public string  ContactNumber   { get; set; }
      public string  Email   { get; set; }
      //public string  Lender  { get; set; }
      //public string  LenderAddress   { get; set; }
      public string  AssignedGM  { get; set; }
      public string  GMRegion    { get; set; }
      public string  AssignedGMEmail { get; set; }
      public string  AssignedPO  { get; set; }
      public string  AssignedPODesignation   { get; set; }
      public string  AssignedPOContactNo { get; set; }
      public string  AssignedPOEmail { get; set; }
      public string  AssignedEO  { get; set; }
      public string  AssignedEODesignation   { get; set; }
      public string  AssignedEOContactNo { get; set; }
      public string  AssignedEOEmail { get; set; }
      public string  AssignedLO  { get; set; }
      public string  AssignedLODesignation   { get; set; }
      public string  AssignedLOContactNo { get; set; }
      public string  AssignedLOEmail { get; set; }
      public string  LEName  { get; set; }
      public string  LEDesignation   { get; set; }
      public string  LEContactNo { get; set; }
      public string  LEEmail { get; set; }
      public string  LFAName { get; set; }
      public string  LFADesignation  { get; set; }
      public string  LFAContactNo    { get; set; }
      public string  LFAEmail    { get; set; }
      public string  LIAName { get; set; }
      public string  LIADesignation  { get; set; }
      public string  LIAContactNo    { get; set; }
      public string  LIAEmail    { get; set; }
      public string  LLCName { get; set; }
      public string  LLCDesignation  { get; set; }
      public string  LLCContactNo    { get; set; }
      public string  LLCEmail    { get; set; }
      public DateTime? CreatedDate { get; set; }
      public string  CreatedBy   { get; set; }
      public DateTime? UpdatedDate { get; set; }
      public string  UpdatedBy { get; set; }


    }
}
