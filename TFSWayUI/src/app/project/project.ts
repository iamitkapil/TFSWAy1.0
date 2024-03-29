﻿export interface IProject {

    projectId: number;
    projectManagerId: number;
    supervisorId: number;
    groupId: number;
    companyId: number;
    projectName: string;
    projectStartDate: string;
    projectEndDate: string;
    status: string;
    cinNumber: string;
    officeAddress: string;
    pan: string;
    incorporationDate: string;
    country: string;
    state: string;
    plantLocation: string;
    planttype: string;
    technology: string;
    substation: string;
    projectSize: string;
    capacity_AC: string;
    projectCapacityUnit: string;
    projectTariffUnit: string;
    capacity_DC: string; 
    totalCost: string;
    costperMW_AC: string;
    costperMW_DC: string;
    totalDebt: string;  
    totalEquity: string;
    debtEquityRatio: string;
    minDSCR: string;
    avgDSCR: string;
    irr: string;
    cuf: string;
    scod: string;
    tariff: string;
    ppaDate: string;
    vgf: string;
    discom: string;
    creditCompRating: string;
    creditPromRating: string;
    tfsShadowRating: string;
    dtdTenure: string;
    repaymentPeriod: string;
    preliminaryScrDate: string;
    requiredLand: string;
    emloyeeID: string;
    omContractor: string;
    epcContractor: string;
    traBanker: string;
    sanctionLetterNo: string;
    sanctionLetterDate: string;
    rtLdate: string;
    deedofHypotheciationDate: string;
    chargeHypotheciationDate: string;
    deedofpledgeDate: string;
    chargepledgeDate: string;
    iomDate: string;
    chargeiomDate: string;
    mortgageDate: string;
    chargemortgageDate: string;
    currentStage: string;
    reason: string;
    createdDate: string;
    createdBy: string;
    updatedDate: string;
    updatedBy: string; 
    loaDate: string;
    registeredAddress: string;

}
