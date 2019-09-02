
export interface IProject {

    projectId: number;
    projectGroup: string;
    projectName: string;
    projectCapacityAC: string;
    projectCapacityDC: string;
    projectLocation: string;
    projectTotalCost: string;
    projectEquity: string;
    projectCreditRating: string;
    projectDebt: string;
    projectIRR: string;
    projectMinDSCR: string;
    projectAvgDSCR: string;
    projectDiscom: string;
    projectTarrif: string;
    projectSCOD: string;
    strategyProposal: IStrategyProposal;
}

export interface IStrategyProposal {

    strategyProposalId: number;
    projectId: number;
    ppaTerminationClause: string;
    ppaLiquidatedDamages: string;
    ppaPaymentmechanism: string;
    ppaOthers: string;
    experienceinRelSec: string;
    financialStrenth: string;
    indicativeEquityArrangement: string;
    prevRelationwithLender: string;
    tenure: string;
    roi: string;
    termsAndConditions: string;
    powerFinCorp: string;
    ruralElectrificationCorp: string;
    policyCompOthers: string;
    strategyAdopted: string;
    status: string;
    remarks: string;
    createdDate: string;
    createdBy: string;
    updatedDate: string;
    updatedBy: string;
}

