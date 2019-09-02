import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { UserService } from '../service/user.service'

@Component({
    selector: 'app-menu',
    templateUrl: 'app/menu/menu.component.html',
    styleUrls: ['app/menu/menu.component.css']
})


export class MenuComponent implements OnInit {

    id: any;
    paramsSub: any;
    private activeuserdesignation: string;
    public isAdmin: boolean = false;

    constructor(private activatedRoute: ActivatedRoute, private _user: UserService) {
        this.activeuserdesignation = _user.Designation
        if (this.activeuserdesignation == 'Admin')
            this.isAdmin = true;
    }

    ngOnInit() {
        this.paramsSub = this.activatedRoute.params.subscribe(params => this.id = +params['id']);
    }

    ngOnDestroy() {
        this.paramsSub.unsubscribe();
    }

}