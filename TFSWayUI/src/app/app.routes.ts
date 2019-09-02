﻿import { RouterModule, Routes } from '@angular/router';
import { LoginFormComponent } from './loginform/loginform.component';
import { DashBoardComponent } from './dashboard/dashboard.component';
import { MaindashboardComponent } from './maindashboard/maindashboard.component';
import { AuthguardGuard } from './guard/authguard.guard';
import { HomeComponent } from './home/home.component';
import { CustomerComponent } from './customer/customer.component';
import { PageNotFoundComponent } from './others/pagenotfound.component';
import { CustomerListComponent } from './customer/customerlist.component';
import { CustomerDetailsComponent } from './customer/customerdetails.component';
import { CostBreakupComponent } from './costbreakup/costbreakup.component';
import { ProjectCompanyComponent } from './home/projectcompany.component';
import { PromoterDetailComponent } from './promoter/promoterdetail.component';
import { PromoterListComponent } from './promoter/promoterlist.component';
import { ProjectComponent } from './project/project.component'
import { TeaserListComponent } from './teaser/teaserlist.component';
import { StrategyProposalListComponent } from './strategyproposal/strategyproposallist.component';
import { TeaserComponent } from './teaser/teaser.component';
import { TeaserviewComponent } from './teaser/teaserview.component';
import { StrategyProposalComponent } from './strategyproposal/strategyproposal.component';
import { StrategyProposalviewComponent } from './strategyproposal/strategyproposalview.component';
import { DirectorComponent } from './director/director.component';
import { DirectorListComponent } from './director/directorlist.component';
import { ShareholderComponent } from './shareholder/shareholder.component';
import { ShareholderListComponent } from './shareholder/shareholderlist.component';
import { ProjectStatusComponent } from './projectstatus/projectstatus.component';
import { UploadDocumentComponent } from './uploaddocument/uploaddocument.component';
import { TaskTrackerComponent } from './tasktracker/tasktracker.component';
import { TaskTrackerListComponent } from './tasktracker/tasktrackerlist.component';
import { MeetingComponent } from './meeting/meeting.component';
import { MeetingListComponent } from './meeting/meetinglist.component';
import { ProjectPlanComponent } from './projectplan/projectplan.component';
import { ProjectPlanListComponent } from './projectplan/projectplanlist.component';
import { QueryComponent } from './query/query.component';
import { QueryExporttoExcelComponent } from './query/queryexporttoexcel.component';
import { QueryListComponent } from './query/querylist.component';
import { DocumentComponent } from './document/document.component';
import { DocumentListComponent } from './document/documentlist.component';
import { ReplyComponent } from './query/reply.component';
import { ReplyListComponent } from './query/replylist.component';
import { LenderComponent } from './lender/lender.component';
import { AgencyListComponent } from './agency/agencylist.component';
import { AgencyComponent } from './agency/agency.component';
import { GroupListComponent } from './group/grouplist.component';
import { GroupComponent } from './group/group.component';
import { AuthorizedPersonComponent } from './authorizedperson/authorizedperson.component';
import { AuthorizedPersonListComponent } from './authorizedperson/authorizedpersonlist.component';
import { MailComponent } from './mail/mail.component';
import { ProgressReportComponent } from './report/progressreport.component';
import { ActivityReportComponent } from './report/activityreport.component';
import { DocumentReportComponent } from './report/documentreport.component';
import { QueryReportComponent } from './report/queryreport.component';

export const routes: Routes = [
    { path: '', component: LoginFormComponent },
    {
        path: 'dashboard',
        canActivate: [AuthguardGuard],
        component: DashBoardComponent,
        children: [
            { path: '', component: MaindashboardComponent },
            { path: 'home', component: HomeComponent },
            { path: 'projectcompany/add', component: ProjectCompanyComponent },
            { path: 'teaser/add', component: TeaserComponent },
            { path: 'strategyproposal/add', component: StrategyProposalComponent },
            { path: 'strategyproposal/edit/:id', component: StrategyProposalComponent },
            { path: 'strategyproposal/view/:id', component: StrategyProposalviewComponent },
            { path: 'projectcompany/edit/:id', component: ProjectCompanyComponent },
            { path: 'teaser/edit/:id', component: TeaserComponent },
            { path: 'teaser/add', component: TeaserComponent },
            { path: 'teaser/view/:id', component: TeaserviewComponent },
            { path: 'customer', component: CustomerComponent},
            { path: 'costbreakup', component: CostBreakupComponent },
            { path: 'project', component: ProjectComponent },
            { path: 'promoter', component: PromoterListComponent },
            { path: 'promoter/add', component: PromoterDetailComponent },
            { path: 'promoter/edit/:id', component: PromoterDetailComponent },
            { path: 'director', component: DirectorListComponent },
            { path: 'director/add', component: DirectorComponent },
            { path: 'director/edit/:id', component: DirectorComponent },
            { path: 'lender/add/:id', component: LenderComponent },
            { path: 'shareholder', component: ShareholderListComponent },
            { path: 'shareholder/add', component: ShareholderComponent },
            { path: 'shareholder/edit/:id', component: ShareholderComponent },
            { path: 'costbreakup', component: CostBreakupComponent },
            { path: 'teaser', component: TeaserListComponent },
            { path: 'projectcurrentstatus', component: ProjectStatusComponent },
            { path: 'strategyproposal', component: StrategyProposalListComponent },
            { path: 'customerlist', component: CustomerListComponent },
            { path: "customer/add", component: CustomerComponent },
            { path: "customer/edit/:id", component: CustomerComponent },
            { path: 'document', component: DocumentListComponent },
            { path: 'masterdocument', component: DocumentComponent },
            { path: 'document/uploaddocument/edit/:id', component: UploadDocumentComponent },
            { path: 'document/uploaddocument', component: UploadDocumentComponent },
            { path: 'tasktrackerList', component: TaskTrackerListComponent },
            { path: 'tasktracker', component: TaskTrackerComponent },
            { path: 'meetingandminutes/add', component: MeetingComponent },
            { path: 'meetingandminutes', component: MeetingListComponent },
            { path: 'projectplan/projectactivityplan', component: ProjectPlanComponent },
            { path: 'projectplan/projectactivityplan/edit/:id/:status', component: ProjectPlanComponent },
            { path: 'projectplan', component: ProjectPlanListComponent },
            { path: 'queriesandissue/add', component: QueryComponent },
            { path: 'queriesandissue/edit/:id', component: QueryComponent },
            { path: 'queriesandissue', component: QueryListComponent },
            { path: 'queriesandissue/exporttoexcel/:id/:type', component: QueryExporttoExcelComponent },
            { path: 'queriesandissue/allreply', component: ReplyComponent },
            { path: 'queriesandissue/replylist/:queryId', component: ReplyListComponent },
            { path: 'queriesandissue/replylist/:queryId/add', component: ReplyComponent },
            { path: 'queriesandissue/replylist/:replyId/update', component: ReplyComponent },
            { path: 'agency', component: AgencyListComponent },
            { path: 'agency/add', component: AgencyComponent },
            { path: 'agency/edit/:id', component: AgencyComponent },
            { path: 'group', component: GroupListComponent },
            { path: 'group/add', component: GroupComponent },
            { path: 'group/edit/:id', component: GroupComponent },
            { path: 'authorizedperson', component: AuthorizedPersonListComponent },
            { path: 'authorizedperson/add', component: AuthorizedPersonComponent },
            { path: 'authorizedperson/edit/:id', component: AuthorizedPersonComponent },
            { path: 'mail/mail/:Docid/:Queryid/:SubjectType', component: MailComponent },
            { path: 'progressreport', component: ProgressReportComponent },
            { path: 'activityreport', component: ActivityReportComponent },
            { path: 'documentreport', component: DocumentReportComponent },
            { path: 'queryreport', component: QueryReportComponent }
        ]
    },
    { path: '**', component: PageNotFoundComponent }
];