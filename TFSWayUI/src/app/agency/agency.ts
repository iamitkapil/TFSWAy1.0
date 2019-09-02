export interface IAgency {

    agencyId: number;
    agencyType: number;
    agencyName: string;
    agencyAddress: string;
    createdDate: string;
    createdBy: string;
    updatedDate: string;
    updatedBy: string;
}

export enum AgencyType
 {
   Consultant=1,
   Lender=2,
   LE=3,
   LFA=4,
   LIA=5,
   LLC=6
  }

