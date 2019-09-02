export interface IAuthorisedPerson {

    authorisedPersonId: number;
    companyId?: number
    authorisedPersonPromoterId?: number;
    authorisedPersonAgencyId?: number;
    agencyType: string;
    agencyName: string
    agencyAddress: string 
    name: string;
    role: string;
    contactNumber: string;
    landlineNumber: string;
    email: string;
    chkCoordinator?: boolean;
    isCoordinator: string;
    createdDate: string;
    createdBy: string;
    updatedDate: string;
    updatedBy: string;
}

export enum AgencyType {
    Consultant = 1,
    Company = 2,
    Lender = 3,
    LE = 4,
    LFA = 5,
    LIA = 6,
    LLC = 7,
    Promoter = 8,
 }
