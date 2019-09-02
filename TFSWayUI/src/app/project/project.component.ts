import { Component, OnInit, AfterViewInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms'
import { Projectservice } from '../service/project.service';
import { ActivatedRoute, Router, ParamMap } from '@angular/router';
import { NgProgress } from 'ngx-progressbar';
import { Http, Headers, RequestOptions, Response } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/switchMap';
import { IMyDpOptions, IMyDateModel, IMyInputFieldChanged } from 'mydatepicker';
import { PagerService } from '../service/pager.service';
import { UserService } from '../service/user.service';
import { GroupService } from '../service/group.service';
import { IGroup } from '../group/group';
let saveAs = require('file-saver');
//import { CompanyService } from '../service/company.service';
//import { DirectorService } from '../service/director.service';
//import { IDirector } from '../director/director';
//import { AuthorisedPersonService } from '../service/authorisedperson.service';
//import { IAuthorisedPerson } from '../authorizedperson/authorisedperson'
//import { ShareholderService } from '../service/shareholder.service'
//import { IShareholder } from '../shareholder/shareholder'


@Component({
    selector: 'app-project',
    templateUrl: 'app/project/project.component.html',
    styleUrls: ['app/project/project.component.css'],
    providers: [Projectservice, GroupService]

})


export class ProjectComponent implements OnInit {

    private activeuserid: number;
    private activeuserdesignation: string;

    public myDatePickerOptions: IMyDpOptions = {
        dateFormat: 'dd-mm-yyyy',
        height: '23px',
        showInputField: true,
        width: '160px'
    };


    projectForm: FormGroup;
    associationtype: string = "";
    projectId: number = 0;
    companyId: number = 0;
    errorMessage: any;
    submitted: boolean = false;
    _ref: any;
    groupname: string = ""; 
    companyname: string = "";
    totalcost: string = "";
    totaldebt: string = "";
    projectUnit: string = "";
    projecttariffunit: string = "";


    constructor(private _fb: FormBuilder,
        private _avRoute: ActivatedRoute,
        private _projectservice: Projectservice,
        private _groupservice: GroupService,
        private _router: Router,
        public ngProgress: NgProgress, private _user: UserService) {

        this.activeuserdesignation = _user.Designation;
        this.activeuserid = _user.AuthorisedPersonId;
        this.projectId = _user.ActiveProjectId;
        this.companyId = _user.ActiveCompanyId;
        this.associationtype = "Project";





        this.projectForm = this._fb.group({
            projectId: 0,
            groupId: 0,
            companyId: 0,
            projectManagerId: 0,
            supervisorId: 0,
            projectName: (''),
            projectStartDate: (''),
            projectEndDate: (''),
            status: (''),
            cinNumber: (''),
            siteAddress: (''),
            pan: (''),
            incorporationDate: (null),
            country: (''),
            state: (''),
            plantLocation: (''),
            planttype: (''),
            technology: (''),
            substation: (''),
            projectSize: (''),
            capacity_AC: ['', [Validators.pattern("\\d*")]],
            capacity_DC: ['', [Validators.pattern("\\d*")]],
            projectTariffUnit: (''), 
            projectCapacityUnit: (''), 
            totalCost: (''),
            costperMW_AC: (''),
            costperMW_DC: (''),
            totalDebt: (''),
            totalEquity: ['', [Validators.pattern("\\d*(\\.\\d{0,2})?")]],
            debtEquityRatio: (''),
            minDSCR: ['', [Validators.pattern("\\d*(\\.\\d{0,2})?")]],
            avgDSCR: ['', [Validators.pattern("\\d*(\\.\\d{0,2})?")]],
            irr: ['', [Validators.pattern("\\d*(\\.\\d{0,2})?")]],
            cuf: ['', [Validators.pattern("\\d*(\\.\\d{0,2})?")]],
            scod: (null),
            tariff: ['', [Validators.pattern("\\d*(\\.\\d{0,2})?")]],
            ppaDate: (null),
            vgf: ['', [Validators.pattern("\\d*(\\.\\d{0,2})?")]],
            discom: (''),
            creditCompRating: (''),
            creditPromRating: (''),
            tfsShadowRating: (''),
            dtdTenure: (''),
            repaymentPeriod: (''),
            preliminaryScrDate: (null),
            requiredLand: (''),
            emloyeeID: (''),
            omContractor: (''),
            epcContractor: (''),
            traBanker: (''),
            sanctionLetterNo: (''),
            sanctionLetterDate: (null),
            rtLdate: (null),
            deedofHypotheciationDate: (null),
            chargeHypotheciationDate: (null),
            currentStage: (''),
            reason: (''),
            deedofpledgeDate: (null),
            chargepledgeDate: (null),
            iomDate: (null),
            chargeiomDate: (null),
            mortgageDate: (null),
            chargemortgageDate: (null),
            createdDate: (''),
            createdBy: (''),
            updatedDate: (''),
            updatedBy: (''),
            loaDate: (''),
            registeredAddress: ('')
        })


        if (this.activeuserdesignation == "Supervisor")
            this.projectForm.disable(true);



    }

    Getgroup() {

        this._groupservice.getGroup(this.companyId)
            .subscribe(resp => {
                this.groupname = resp.groupName;
                this.companyname = resp.companyName;
            }
            , error => this.errorMessage = error);
    }

    formatDate(date: Date) {
        var monthNames = [
            "Jan", "Feb", "Mar",
            "Apr", "May", "Jun", "Jul",
            "Aug", "Sep", "Oct",
            "Nov", "Dec"
        ];
        var strday = '';
        var day = date.getDate();
        if (day.toString().length == 1)
            strday = "0" + day.toString();
        else
            strday = day.toString();
        var monthIndex = date.getMonth();
        var year = date.getFullYear();

        return strday + '/' + monthNames[monthIndex] + '/' + year;
    }

    ngOnInit() {
        //this.Getgroup();
        if (this.projectId > 0) {
            this._projectservice.getProjectCompany(this.projectId)
                .subscribe(resp => {

                    this.projectForm.setValue(resp.project);
                    this.projectForm.controls["projectStartDate"].setValue(this.formatDate(new Date(resp.project.projectStartDate)));
                    this.projectForm.controls["projectEndDate"].setValue(this.formatDate(new Date(resp.project.projectEndDate)));
                    this.projectForm.controls["loaDate"].setValue(this.formatDate(new Date(resp.project.loaDate)));
                    this.projectUnit = resp.project.projectCapacityUnit;
                    this.projecttariffunit = resp.project.projectTariffUnit;
                    this.totalcost = parseFloat(resp.project.totalCost) > 0 ? resp.project.totalCost : "";
                    this.totaldebt = parseFloat(resp.project.totalDebt) > 0 ? resp.project.totalDebt : "";

                    //this.projectForm.controls["totalDebt"].setValue(resp.totalDebt);
                    this.groupname = resp.group.groupName;
                    this.companyname = resp.company.companyName;

                    if (resp.project.incorporationDate != null) {
                        let incorporationdate = new Date(resp.project.incorporationDate);
                        this.projectForm.patchValue({
                            incorporationDate: {
                                date: {
                                    year: incorporationdate.getFullYear(),
                                    month: incorporationdate.getMonth() + 1,
                                    day: incorporationdate.getDate()
                                }
                            }
                        });
                    }

                    if (resp.project.scod != null) {
                        let scod = new Date(resp.project.scod);

                        this.projectForm.patchValue({
                            scod: {
                                date: {
                                    year: scod.getFullYear(),
                                    month: scod.getMonth() + 1,
                                    day: scod.getDate()
                                }
                            }
                        });
                    }

                    if (resp.project.ppaDate != null) {
                        let ppadate = new Date(resp.project.ppaDate);

                        this.projectForm.patchValue({
                            ppaDate: {
                                date: {
                                    year: ppadate.getFullYear(),
                                    month: ppadate.getMonth() + 1,
                                    day: ppadate.getDate()
                                }
                            }
                        });
                    }


                    if (resp.project.preliminaryScrDate != null) {
                        let preliminaryscrdate = new Date(resp.project.preliminaryScrDate);

                        this.projectForm.patchValue({
                            preliminaryScrDate: {
                                date: {
                                    year: preliminaryscrdate.getFullYear(),
                                    month: preliminaryscrdate.getMonth() + 1,
                                    day: preliminaryscrdate.getDate()
                                }
                            }
                        });
                    }

                    if (resp.project.sanctionLetterDate != null) {
                        let sanctionletterdate = new Date(resp.project.sanctionLetterDate);

                        this.projectForm.patchValue({
                            sanctionLetterDate: {
                                date: {
                                    year: sanctionletterdate.getFullYear(),
                                    month: sanctionletterdate.getMonth() + 1,
                                    day: sanctionletterdate.getDate()
                                }
                            }
                        });
                    }

                    if (resp.project.rtLdate != null) {
                        let rtldate = new Date(resp.project.rtLdate);

                        this.projectForm.patchValue({
                            rtLdate: {
                                date: {
                                    year: rtldate.getFullYear(),
                                    month: rtldate.getMonth() + 1,
                                    day: rtldate.getDate()
                                }
                            }
                        });
                    }

                    if (resp.project.rtLdate != null) {
                        let rtldate = new Date(resp.project.rtLdate);

                        this.projectForm.patchValue({
                            rtLdate: {
                                date: {
                                    year: rtldate.getFullYear(),
                                    month: rtldate.getMonth() + 1,
                                    day: rtldate.getDate()
                                }
                            }
                        });
                    }

                    if (resp.project.deedofHypotheciationDate != null) {
                        let deedofhypotheciationdate = new Date(resp.project.deedofHypotheciationDate);

                        this.projectForm.patchValue({
                            deedofHypotheciationDate: {
                                date: {
                                    year: deedofhypotheciationdate.getFullYear(),
                                    month: deedofhypotheciationdate.getMonth() + 1,
                                    day: deedofhypotheciationdate.getDate()
                                }
                            }
                        });
                    }
                    if (resp.project.chargeHypotheciationDate != null) {
                        let chargeHypotheciationdate = new Date(resp.project.chargeHypotheciationDate);

                        this.projectForm.patchValue({
                            chargeHypotheciationDate: {
                                date: {
                                    year: chargeHypotheciationdate.getFullYear(),
                                    month: chargeHypotheciationdate.getMonth() + 1,
                                    day: chargeHypotheciationdate.getDate()
                                }
                            }
                        });
                    }

                    if (resp.project.deedofpledgeDate != null) {
                        let deedofpledgedate = new Date(resp.project.deedofpledgeDate);

                        this.projectForm.patchValue({
                            deedofpledgeDate: {
                                date: {
                                    year: deedofpledgedate.getFullYear(),
                                    month: deedofpledgedate.getMonth() + 1,
                                    day: deedofpledgedate.getDate()
                                }
                            }
                        });
                    }
                    if (resp.project.chargepledgeDate != null) {
                        let chargepledgedate = new Date(resp.project.chargepledgeDate);

                        this.projectForm.patchValue({
                            chargepledgeDate: {
                                date: {
                                    year: chargepledgedate.getFullYear(),
                                    month: chargepledgedate.getMonth() + 1,
                                    day: chargepledgedate.getDate()
                                }
                            }
                        });
                    }
                    if (resp.project.iomDate != null) {
                        let iomdate = new Date(resp.project.iomDate);

                        this.projectForm.patchValue({
                            iomDate: {
                                date: {
                                    year: iomdate.getFullYear(),
                                    month: iomdate.getMonth() + 1,
                                    day: iomdate.getDate()
                                }
                            }
                        });
                    }
                    if (resp.project.chargeiomDate != null) {
                        let chargeiomdate = new Date(resp.project.chargeiomDate);

                        this.projectForm.patchValue({
                            chargeiomDate: {
                                date: {
                                    year: chargeiomdate.getFullYear(),
                                    month: chargeiomdate.getMonth() + 1,
                                    day: chargeiomdate.getDate()
                                }
                            }
                        });
                    }

                    if (resp.project.mortgageDate != null) {
                        let mortgagedate = new Date(resp.project.mortgageDate);

                        this.projectForm.patchValue({
                            mortgageDate: {
                                date: {
                                    year: mortgagedate.getFullYear(),
                                    month: mortgagedate.getMonth() + 1,
                                    day: mortgagedate.getDate()
                                }
                            }
                        });
                    }
                    if (resp.project.chargemortgageDate != null) {
                        let chargemortgagedate = new Date(resp.project.chargemortgageDate);

                        this.projectForm.patchValue({
                            chargemortgageDate: {
                                date: {
                                    year: chargemortgagedate.getFullYear(),
                                    month: chargemortgagedate.getMonth() + 1,
                                    day: chargemortgagedate.getDate()
                                }
                            }
                        });
                    }

                }
                , error => this.errorMessage = error);


        }

    }

    save() {

        if (this.incorporationDate.value != null) {
            if (this.incorporationDate.value.formatted != null)
                this.incorporationDate.setValue(this.incorporationDate.value.formatted);
            else
                if (this.incorporationDate.value.date != null)
                    this.incorporationDate.setValue(this.incorporationDate.value.date.year + '-' + this.incorporationDate.value.date.month + '-' + this.incorporationDate.value.date.day)
                else
                    this.incorporationDate.setValue(this.incorporationDate.value);
        }

        //scod
        if (this.scod.value != null) {
            if (this.scod.value.formatted != null)
                this.scod.setValue(this.scod.value.formatted);
            else
                if (this.scod.value.date != null)
                    this.scod.setValue(this.scod.value.date.year + '-' + this.scod.value.date.month + '-' + this.scod.value.date.day)
                else
                    this.scod.setValue(this.scod.value);
        }

        //ppaDate
        if (this.ppaDate.value != null) {
            if (this.ppaDate.value.formatted != null)
                this.ppaDate.setValue(this.ppaDate.value.formatted);
            else
                if (this.ppaDate.value.date != null)
                    this.ppaDate.setValue(this.ppaDate.value.date.year + '-' + this.ppaDate.value.date.month + '-' + this.ppaDate.value.date.day)
                else
                    this.ppaDate.setValue(this.ppaDate.value);
        }

        //preliminaryScrDate
        if (this.preliminaryScrDate.value != null) {
            if (this.preliminaryScrDate.value.formatted != null)
                this.preliminaryScrDate.setValue(this.preliminaryScrDate.value.formatted);
            else
                if (this.preliminaryScrDate.value.date != null)
                    this.preliminaryScrDate.setValue(this.preliminaryScrDate.value.date.year + '-' + this.preliminaryScrDate.value.date.month + '-' + this.preliminaryScrDate.value.date.day)
                else
                    this.preliminaryScrDate.setValue(this.preliminaryScrDate.value);
        }

        //sanctionLetterDate
        if (this.sanctionLetterDate.value != null) {
            if (this.sanctionLetterDate.value.formatted != null)
                this.sanctionLetterDate.setValue(this.sanctionLetterDate.value.formatted);
            else
                if (this.sanctionLetterDate.value.date != null)
                    this.sanctionLetterDate.setValue(this.sanctionLetterDate.value.date.year + '-' + this.sanctionLetterDate.value.date.month + '-' + this.sanctionLetterDate.value.date.day)
                else
                    this.sanctionLetterDate.setValue(this.sanctionLetterDate.value);
        }

        //rtLdate
        if (this.rtLdate.value != null) {
            if (this.rtLdate.value.formatted != null)
                this.rtLdate.setValue(this.rtLdate.value.formatted);
            else
                if (this.rtLdate.value.date != null)
                    this.rtLdate.setValue(this.rtLdate.value.date.year + '-' + this.rtLdate.value.date.month + '-' + this.rtLdate.value.date.day)
                else
                    this.rtLdate.setValue(this.rtLdate.value);
        }

        //deedofHypotheciationDate
        if (this.deedofHypotheciationDate.value != null) {
            if (this.deedofHypotheciationDate.value.formatted != null)
                this.deedofHypotheciationDate.setValue(this.deedofHypotheciationDate.value.formatted);
            else
                if (this.deedofHypotheciationDate.value.date != null)
                    this.deedofHypotheciationDate.setValue(this.deedofHypotheciationDate.value.date.year + '-' + this.deedofHypotheciationDate.value.date.month + '-' + this.deedofHypotheciationDate.value.date.day)
                else
                    this.deedofHypotheciationDate.setValue(this.deedofHypotheciationDate.value);
        }

        //chargeHypotheciationDate
        if (this.chargeHypotheciationDate.value != null) {
            if (this.chargeHypotheciationDate.value.formatted != null)
                this.chargeHypotheciationDate.setValue(this.chargeHypotheciationDate.value.formatted);
            else
                if (this.chargeHypotheciationDate.value.date != null)
                    this.chargeHypotheciationDate.setValue(this.chargeHypotheciationDate.value.date.year + '-' + this.chargeHypotheciationDate.value.date.month + '-' + this.chargeHypotheciationDate.value.date.day)
                else
                    this.chargeHypotheciationDate.setValue(this.chargeHypotheciationDate.value);
        }

        //deedofpledgeDate
        if (this.deedofpledgeDate.value != null) {
            if (this.deedofpledgeDate.value.formatted != null)
                this.deedofpledgeDate.setValue(this.deedofpledgeDate.value.formatted);
            else
                if (this.deedofpledgeDate.value.date != null)
                    this.deedofpledgeDate.setValue(this.deedofpledgeDate.value.date.year + '-' + this.deedofpledgeDate.value.date.month + '-' + this.deedofpledgeDate.value.date.day)
                else
                    this.deedofpledgeDate.setValue(this.deedofpledgeDate.value);
        }

        //chargepledgeDate
        if (this.chargepledgeDate.value != null) {
            if (this.chargepledgeDate.value.formatted != null)
                this.chargepledgeDate.setValue(this.chargepledgeDate.value.formatted);
            else
                if (this.chargepledgeDate.value.date != null)
                    this.chargepledgeDate.setValue(this.chargepledgeDate.value.date.year + '-' + this.chargepledgeDate.value.date.month + '-' + this.chargepledgeDate.value.date.day)
                else
                    this.chargepledgeDate.setValue(this.chargepledgeDate.value);
        }

        //iomDate
        if (this.iomDate.value != null) {
            if (this.iomDate.value.formatted != null)
                this.iomDate.setValue(this.iomDate.value.formatted);
            else
                if (this.iomDate.value.date != null)
                    this.iomDate.setValue(this.iomDate.value.date.year + '-' + this.iomDate.value.date.month + '-' + this.iomDate.value.date.day)
                else
                    this.iomDate.setValue(this.iomDate.value);
        }

        //chargeiomDate
        if (this.chargeiomDate.value != null) {
            if (this.chargeiomDate.value.formatted != null)
                this.chargeiomDate.setValue(this.chargeiomDate.value.formatted);
            else
                if (this.chargeiomDate.value.date != null)
                    this.chargeiomDate.setValue(this.chargeiomDate.value.date.year + '-' + this.chargeiomDate.value.date.month + '-' + this.chargeiomDate.value.date.day)
                else
                    this.chargeiomDate.setValue(this.chargeiomDate.value);
        }

        //mortgageDate
        if (this.mortgageDate.value != null) {
            if (this.mortgageDate.value.formatted != null)
                this.mortgageDate.setValue(this.mortgageDate.value.formatted);
            else
                if (this.mortgageDate.value.date != null)
                    this.mortgageDate.setValue(this.mortgageDate.value.date.year + '-' + this.mortgageDate.value.date.month + '-' + this.mortgageDate.value.date.day)
                else
                    this.mortgageDate.setValue(this.mortgageDate.value);
        }

        //chargemortgageDate
        if (this.chargemortgageDate.value != null) {
            if (this.chargemortgageDate.value.formatted != null)
                this.chargemortgageDate.setValue(this.chargemortgageDate.value.formatted);
            else
                if (this.chargemortgageDate.value.date != null)
                    this.chargemortgageDate.setValue(this.chargemortgageDate.value.date.year + '-' + this.chargemortgageDate.value.date.month + '-' + this.chargemortgageDate.value.date.day)
                else
                    this.chargemortgageDate.setValue(this.chargemortgageDate.value);
        }


        //if (parseFloat(this.projectForm.controls["totalCost"].value) > 0)
        //    this.projectForm.controls["totalCost"].patchValue((this.projectForm.controls["totalCost"].value))

        if (!this.projectForm.valid) {
            this.submitted = true;
            return;
        }
        this.ngProgress.start();

        this._projectservice.saveProject(this.projectForm.value).subscribe(resp => {
            this.errorMessage = resp;
            if (this.errorMessage.includes("Successfully")) {
                //    this._router.navigate(["/dashboard"]);
            } this.ngProgress.done();
        });

        //setTimeout(() => {
        //    this.ngProgress.done();
        //    this._router.navigate(["/dashboard"]);
        //}, 1000);

    }

    calccostAC() {
        let totalcost = 0;
        if (parseFloat(this.capacity_AC.value) > 0 && parseFloat(this.totalcost) > 0) {
            totalcost = (parseFloat(this.totalcost) / parseFloat(this.capacity_AC.value));
        }
        return totalcost.toFixed(2);
    }

    calccostDC() {
        let totalcost = 0;
        if (parseFloat(this.capacity_DC.value) > 0 && parseFloat(this.totalcost) > 0) {
            totalcost = (parseFloat(this.totalcost) / parseFloat(this.capacity_DC.value));
        }
        return totalcost.toFixed(2);
    }

    calcDebtIsToEquity() {
        var debtistoequityratio =""
        if (this.calcEquity() != "") {
            //var gcd = this.GCD(parseFloat(this.totalEquity.value), parseFloat(this.totaldebt));
            //return (parseFloat(this.totaldebt) / gcd) + ":" + (parseFloat(this.totalEquity.value) / gcd);
            if ((parseFloat(this.totaldebt) % parseFloat(this.calcEquity()))==0)
                debtistoequityratio = (parseFloat(this.totaldebt) / parseFloat(this.calcEquity())).toString() + ":" + "1" 
            else
                debtistoequityratio = (parseFloat(this.totaldebt) / parseFloat(this.calcEquity())).toFixed(2) + ":" + "1"   

        }

        return debtistoequityratio
    }

    //GCD(a: number, b: number): number {
    //    return b == 0 ? Math.abs(a) : this.GCD(b, a % b);
    //}

    calcEquity() {

        let totalequity = "";
        if (this.totalcost != "" && this.totaldebt != "")
            totalequity = (parseFloat(this.totalcost) - parseFloat(this.totaldebt)).toString();
        return totalequity;
    }

    onChangeac(unit: string) {

        if (this.capacity_AC.value != "") {

            if (unit == "KW")
                this.capacity_AC.setValue(1000 * parseFloat(this.capacity_AC.value));
            else 
                this.capacity_AC.setValue( parseFloat(this.capacity_AC.value)/1000);
        }
        
    }

    onChangedc(unit: string) {


        if (this.capacity_DC.value != "") {

            if (unit == "KW")
                this.capacity_DC.setValue(1000 * parseFloat(this.capacity_DC.value));
            else
                this.capacity_DC.setValue(parseFloat(this.capacity_DC.value) / 1000);
        }

    }

    addDirector(type: string, id: number) {

        this._router.navigate(['/dashboard/director/add/' + type + '/' + id]);

    }
    addAuthorizedPerson(type: string, id: number) {

        this._router.navigate(['/dashboard/authorizedperson/add/' + type + '/' + id]);
    }
    addShareholder(type: string, id: number) {
        this._router.navigate(['/dashboard/shareholder/add/' + type + '/' + id]);
    }

    clearDate(): void {
        this.projectForm.patchValue({ incorporationdate: null, ppaDate: null, repaymentPeriod: null, preliminaryScrDate: null, sanctionLetterDate: null });
    }

    ExportToExcel() {
        var ExportGrid = document.getElementById('exportgrid').innerHTML;
        let blob = new Blob([ExportGrid], {
            type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=utf-16le"
        });
        saveAs(blob, "ProjectPlan_" + this.projectId + ".xls");

    }

    onDateChanged(event: IMyDateModel) {

    }

    cancel() {
        this._router.navigate(["/dashboard"]);
    }

    get incorporationDate() { return this.projectForm.get('incorporationDate'); }
    get scod() { return this.projectForm.get('scod'); }
    get iomDate() { return this.projectForm.get('iomDate'); }
    get chargeiomDate() { return this.projectForm.get('chargeiomDate'); }
    get ppaDate() { return this.projectForm.get('ppaDate'); }
    get preliminaryScrDate() { return this.projectForm.get('preliminaryScrDate'); }
    get sanctionLetterDate() { return this.projectForm.get('sanctionLetterDate'); }
    get rtLdate() { return this.projectForm.get('rtLdate'); }
    get deedofHypotheciationDate() { return this.projectForm.get('deedofHypotheciationDate'); }
    get chargeHypotheciationDate() { return this.projectForm.get('chargeHypotheciationDate'); }
    get deedofpledgeDate() { return this.projectForm.get('deedofpledgeDate'); }
    get chargepledgeDate() { return this.projectForm.get('chargepledgeDate'); }
    get mortgageDate() { return this.projectForm.get('mortgageDate'); }
    get chargemortgageDate() { return this.projectForm.get('chargemortgageDate'); }
    //get totalCost() { return this.projectForm.get('totalcost'); }
    get capacity_AC() { return this.projectForm.get('capacity_AC'); }
    get capacity_DC() { return this.projectForm.get('capacity_DC'); }
    get totalEquity() { return this.projectForm.get('totalEquity'); }
    get minDSCR() { return this.projectForm.get('minDSCR'); }
    get avgDSCR() { return this.projectForm.get('avgDSCR'); }
    get irr() { return this.projectForm.get('irr'); }
    get cuf() { return this.projectForm.get('cuf'); }
    get tariff() { return this.projectForm.get('tariff'); }
    get vgf() { return this.projectForm.get('vgf'); }


}