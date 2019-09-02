import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgModule, APP_INITIALIZER } from '@angular/core';
import { HttpModule } from '@angular/http';
import { AppComponent } from './app.component';
import { HeaderComponent } from './header/header.component';
import { LoginFormComponent } from './loginform/loginform.component';
import { FooterComponent } from './footer/footer.component';
import { DashBoardComponent } from './dashboard/dashboard.component';
import { MaindashboardComponent } from './maindashboard/maindashboard.component';
import { RouterModule, Routes } from '@angular/router';
import { UserService } from './service/user.service';
import { AuthguardGuard } from './guard/authguard.guard';
import { MenuComponent } from './Menu/menu.component';
import { HomeComponent } from './home/home.component';
import { CustomerListComponent } from './customer/customerlist.component';
import { routes } from './app.routes';
import { CustomerComponent } from './customer/customer.component';
import { PageNotFoundComponent } from './others/pagenotfound.component';
import { NgProgressModule } from 'ngx-progressbar'
import { OrderModule } from './pipes/ng-order.module';
import { FilterPipe } from './pipes/ng-searchfilter.pipe';
import { PagingPipe } from './pipes/ng-paging.pipe';
import { FileUpload } from './customer/fileupload.component';
import { CustomerDetailsComponent } from './customer/customerdetails.component';
import { CostBreakupComponent } from './costbreakup/costbreakup.component';
import { ProjectCompanyComponent } from './home/projectcompany.component';
import { PromoterDetailComponent } from './promoter/promoterdetail.component';
import { PromoterListComponent } from './promoter/promoterlist.component';
import { ProjectComponent } from './project/project.component'
import { TeaserListComponent } from './teaser/teaserlist.component';
import { StrategyProposalListComponent } from './strategyproposal/strategyproposallist.component';
import { TeaserComponent } from './teaser/teaser.component';
import { StrategyProposalComponent } from './strategyproposal/strategyproposal.component';
import { StrategyProposalviewComponent } from './strategyproposal/strategyproposalview.component';
import { DirectorComponent } from './director/director.component';
import { DirectorListComponent } from './director/directorlist.component';
import { ShareholderComponent } from './shareholder/shareholder.component';
import { ShareholderListComponent } from './shareholder/shareholderlist.component';
import { ChartsModule } from 'ng2-charts';
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
import { ReplyComponent } from './query/reply.component';
import { ReplyListComponent } from './query/replylist.component';
import { DocumentComponent } from './document/document.component';
import { DocumentListComponent } from './document/documentlist.component';
import { MyDatePickerModule } from 'mydatepicker';
import { LenderComponent } from './lender/lender.component';
import { SafeUrlPipe } from './service/pipe.service';
import { TeaserviewComponent } from './teaser/teaserview.component';
import { HtmlDirective } from './service/safehtml.service';
import { MultiselectDropdownModule } from 'angular-2-dropdown-multiselect';
import { AgencyComponent } from './agency/agency.component';
import { AgencyListComponent } from './agency/agencylist.component';
import { GroupComponent } from './group/group.component';
import { GroupListComponent } from './group/grouplist.component';
import { AuthorizedPersonComponent } from './authorizedperson/authorizedperson.component';
import { AuthorizedPersonListComponent } from './authorizedperson/authorizedpersonlist.component';
import { TextMaskModule } from 'angular2-text-mask';
import { AppConfig } from './app.config';
import { MailComponent } from './mail/mail.component';
import { ProgressReportComponent } from './report/progressreport.component';
import { ActivityReportComponent } from './report/activityreport.component';
import { DocumentReportComponent } from './report/documentreport.component';
import { QueryReportComponent } from './report/queryreport.component';

@NgModule({
    imports: [
        RouterModule.forRoot(routes),
        BrowserModule, NgProgressModule, FormsModule, ReactiveFormsModule,
        HttpModule, OrderModule, ChartsModule, MyDatePickerModule, MultiselectDropdownModule,
        TextMaskModule],
    exports: [
        RouterModule
    ],
    declarations: [AppComponent, HeaderComponent, FooterComponent, LoginFormComponent,
        DashBoardComponent, MenuComponent, HomeComponent, CustomerComponent, PageNotFoundComponent,
        CustomerListComponent, FilterPipe, PagingPipe, FileUpload, CustomerDetailsComponent, CostBreakupComponent,
        ProjectCompanyComponent, PromoterListComponent, PromoterDetailComponent, ProjectComponent, TeaserListComponent,
        StrategyProposalListComponent, TeaserComponent, TeaserviewComponent, StrategyProposalComponent, StrategyProposalviewComponent, DirectorComponent,
        DirectorListComponent, AuthorizedPersonComponent, ShareholderComponent, ShareholderListComponent,ProjectStatusComponent, DocumentComponent, TaskTrackerComponent, MeetingComponent,
        ProjectPlanComponent, QueryComponent, UploadDocumentComponent, ProjectPlanListComponent, DocumentListComponent,
        DocumentComponent, QueryListComponent, MeetingListComponent, TaskTrackerListComponent, ReplyComponent,
        ReplyListComponent, LenderComponent, SafeUrlPipe, QueryExporttoExcelComponent, HtmlDirective, AgencyComponent,
        AgencyListComponent, GroupComponent, GroupListComponent, AuthorizedPersonListComponent, MailComponent, MaindashboardComponent,
        ActivityReportComponent, DocumentReportComponent, QueryReportComponent, ProgressReportComponent],
    providers: [UserService, AuthguardGuard, AppConfig,
        { provide: APP_INITIALIZER, useFactory: (config: AppConfig) => () => config.load(), deps: [AppConfig], multi: true }
    ],
    bootstrap: [AppComponent]
})
export class AppModule { }
