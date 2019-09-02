import { Component, OnInit, AfterViewInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms'
import { Projectservice } from '../service/project.service';
import { NgProgress } from 'ngx-progressbar';
import { Location } from '@angular/common';
import { UserService } from '../service/user.service'
import { IUser } from '../loginform/user';
import { IQuery } from './query';
import { Queryservice } from '../service/query.service';
import { IDocument } from '../document/documents';
import { Documentservice } from '../service/document.service';
import { IDocumnetRefList } from '../query/DocumnetRefList';
import { IMultiSelectOption, MultiselectDropdownModule, IMultiSelectTexts, IMultiSelectSettings } from 'angular-2-dropdown-multiselect';
declare var $: any;

@Component({
    selector: 'app-query',
    templateUrl: 'app/query/query.component.html',
    styleUrls: ['app/query/query.component.css'],
    providers: [Documentservice, Queryservice, Projectservice]
})


export class QueryComponent implements OnInit {
    queryForm: FormGroup;
    FormprojectId: number = 0;
    ProjectID: number = 0;
    DocumentList: Array<IDocument> = [];
    formcreateddate: Date = new Date();
    CreatedDate: any;
    refDocuments: string = "";
    CreatedBy: string = "";
    formcreatedby: string = "";
    DocumnetName: string = "";
    queryId: number = 0;
    errorMessage: any;
    IsAdd: boolean = true;
    submitted: boolean = false;
    IsCompleted: boolean = false;
    _ref: any;
    title: string = "Add";

    dropdownSettings: IMultiSelectSettings = {};
    dropdownText: IMultiSelectTexts = {};
    documentListOption: IMultiSelectOption[] = [];
    private selectedDocumentIds: number[] = [];

    constructor(private _location: Location,private _documentservice: Documentservice, private _fb: FormBuilder,
        private _avRoute: ActivatedRoute,
        private _projectservice: Projectservice,
        private _router: Router,
        private _queryservice: Queryservice,
        public ngProgress: NgProgress, private _user: UserService) {
        this.FormprojectId = _user.ActiveProjectId;
        this.formcreatedby = _user.userName;
        if (this._avRoute.snapshot.params["id"]) {
            this.queryId = parseInt(this._avRoute.snapshot.params["id"]);
            console.log(this.queryId);
            this.title = 'Edit';
            this.IsAdd = false;
        }

        this.queryForm = this._fb.group({
            queryId: 0,
            ProjectID: this.FormprojectId,
            QueryText: ['', [Validators.required]],
            Querydate: this.formcreateddate.toUTCString(),
            Replytext: (''),
            ReplyDate: this.formcreateddate.toUTCString(),
            //AssignTo: ['', [Validators.required]],
            //AssignToMailID: ['', [Validators.required, Validators.email]],
            QueryType: ['', [Validators.required]],
            Severity: (''),
            Status: (''),
            RefDocument: this.refDocuments,
            CreatedDate: this.formcreateddate.toUTCString(),
            CreatedBy: this.formcreatedby
        })
    }

    ngOnInit() {
        this.getDocuments();
        if (this.queryId > 0) {

            this._queryservice.getQuerybyId(this.queryId)
                .subscribe(resp => {
                    this.queryForm.patchValue({ queryId: resp.queryId });
                    this.queryForm.controls["QueryText"].setValue(resp.queryText);
                    this.queryForm.controls["Replytext"].setValue(resp.replytext);
                    //this.queryForm.controls["AssignTo"].setValue(resp.assignTo);
                    //this.queryForm.controls["AssignToMailID"].setValue(resp.assignToMailID);
                    this.queryForm.controls["QueryType"].setValue(resp.querytype);
                    this.queryForm.controls["Severity"].setValue(resp.severity);
                    this.queryForm.controls["Status"].setValue(resp.status);
                    this.setSelected(resp.refDocument);
                }
                , error => this.errorMessage = error);

        }


        this.dropdownSettings = {
            enableSearch: true,
            checkedStyle: 'checkboxes',
            buttonClasses: 'btn',
            dynamicTitleMaxItems: 3,
            maxHeight: '200px',
            displayAllSelectedText: true,
            showCheckAll: true,
            showUncheckAll: true

        };


        this.dropdownText = {
            checkAll: 'Select all',
            uncheckAll: 'Unselect all',
            checked: 'item selected',
            checkedPlural: 'items selected',
            searchPlaceholder: 'Find',
            defaultTitle: 'Select Documents',
            allSelected: 'All selected'
        };

    }


    getDocuments() {
        this.ngProgress.start();
        this._documentservice.getDocuments(this.FormprojectId).subscribe((documentdata) => {
            if (documentdata.length != 0) {
                this.DocumentList = documentdata;
                this.setOptionList(this.DocumentList);
            }
        }
            , error => { this.errorMessage = error })
    }

    setOptionList(DocumentList: Array<IDocument>) {

        for (let itm of DocumentList) {
            this.documentListOption = DocumentList.map(item =>
                ({
                    id: item.documentID,
                    name: item.documentName

                }));
        }
    }

    setSelected(index: string) {
        var array = index.split(',');
        for (let itm of array) {
            this.selectedDocumentIds.push(parseInt(itm.toString()));
        }
    }


    onChange(deviceValue: any) {
        this.refDocuments = deviceValue.toString();
    }

    onStatusChange(deviceValue: any) {
        if (deviceValue == "Close")
            this.IsCompleted = true;
        else {
            this.IsCompleted = false;
        }
    }

    save() {
        this.queryForm.patchValue({
            RefDocument: this.refDocuments
        });

        if (!this.queryForm.valid) {
            this.submitted = true;
            return;
        }

        this.ngProgress.start();
        this._queryservice.saveQueries(this.queryForm.value);

        setTimeout(() => {
            this.ngProgress.done();
            this._router.navigate(["/dashboard/queriesandissue"]);
        }, 2000);

    }

    cancel() {
        //this._router.navigate(["/dashboard/queriesandissue"]);
        this._location.back();
    }


    get QueryText() { return this.queryForm.get('QueryText'); }
    get Replytext() { return this.queryForm.get('Replytext'); }
    //get AssignTo() { return this.queryForm.get('AssignTo'); }
    //get AssignToMailID() { return this.queryForm.get('AssignToMailID'); }
    get RefDocument() { return this.queryForm.get('RefDocument').value; }
    get QueryType() { return this.queryForm.get('QueryType').value; }
    get Severity() { return this.queryForm.get('Severity').value; }
    get Status() { return this.queryForm.get('Status').value; }

}