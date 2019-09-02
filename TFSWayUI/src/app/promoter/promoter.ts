export interface IPromoter {
    promoterId: number;
    companyId: number;
    projectId: number;
    name: string;
    changedName: string;
    changedNameDate: string;
    cin: string;
    officeAddress: string;
    pan: string;
    incorporationDate: string;
    chkPromoter?: boolean;
    isMainPromoter: string;
    createdDate: string;
    createdBy: string;
    updatedDate: string;
    updatedBy: string;
}
