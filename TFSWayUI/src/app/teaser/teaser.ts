export interface IProject {

    projectId: number;
    nameoftheCompany: string;
    groupName: string;
    officeAddress: string;
    incorporationDate: string;
    creditCompRating: string;
    projectName: string;
    capacity_AC: string;
    capacity_DC: string;
    plantLocation: string;
    planttype: string;
    technology: string;
    requiredLand: string;
    epcContractor: string;
    totalCost: string;
    omContractor: string;
    debtEquityRatio: string;
    ppaDate: string;
    scod: string;
    cuf: string;
    irr: string;
    minDSCR: string;
    avgDSCR: string;
    dtdTenure: string;
    repaymentPeriod: string;
    tariff: string;
    termLoan: string;
    projectCapacityUnit: string;
    projectTariffUnit: string;
    teaserModel: ITeaserModel;
}


export interface ITeaserModel {
    teaser: ITeaser
    promoter: IPromoter;
    directors: Array<IDirector>;
    shareholders: Array<IShareholder>;
}

export interface ITeaser {
    teaserId: number;
    projectId: number;
    promoterId: number;
    group: string;
    promoterDescription: string;
    expectedROI: string;
    sellingArrangement: string;
    powerEvacuation: string;
    proposedSecurity: string;
    request: string;
    status: string;
    remarks: string;
    createdDate: string;
    createdBy: string;
    updatedDate: string;
    updatedBy: string;

}


export interface IPromoter {
    promoterId: number;
    promoterName: string;
}

export interface IDirector {

    directorId: number;
    directorName: string;
}

export interface IShareholder {
    shareHolderId: number;
    shareholderName: string;
    noofShares: string;
    facevalue: string;
    percentage: string;
    shareholderType: string;
}

