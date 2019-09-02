import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ProjectPlanService } from '../service/projectplan.service';
import { UserService } from '../service/user.service'
import { Location } from '@angular/common';



@Component({
    selector: 'app-projectstatus',
    templateUrl: 'app/projectstatus/projectstatus.component.html',
    styleUrls: ['app/projectstatus/projectstatus.component.css'],
    providers: [ProjectPlanService]
})


export class ProjectStatusComponent implements OnInit {
    // lineChart

    projectId: number;
    activeuserdesignation: string;
    errorMessage: any;

    constructor(private _location: Location,private _router: Router, private _projectplanservice: ProjectPlanService, private _user: UserService) {
        
        this.projectId = _user.ActiveProjectId;
        this.activeuserdesignation = _user.Designation;

        this.barChartData = [
            { data: [], label: 'Projected' },
            { data: [], label: 'InProgress' },
            { data: [], label: 'Delay' },
            { data: [], label: 'Complete' }
        ];

        this.barChartColors = [
            { backgroundColor:[]},
            { backgroundColor: []},
            { backgroundColor: []},
            { backgroundColor: []}
        ];
    }

    ngOnInit()
    {
        this._projectplanservice.getProjectBarGraphData(this.projectId).subscribe((data) =>
        {
            this.barChartLabels = data.activitiesList;
            

            this.barChartData[0].data = data.graphdatalist[0].data;
            this.barChartData[1].data = data.graphdatalist[1].data;
            this.barChartData[2].data = data.graphdatalist[2].data;
            this.barChartData[3].data = data.graphdatalist[3].data;
            
            this.barChartColors[0].backgroundColor = data.graphcolorlist[0].backgroundColor;
            this.barChartColors[1].backgroundColor = data.graphcolorlist[1].backgroundColor;
            this.barChartColors[2].backgroundColor = data.graphcolorlist[2].backgroundColor;
            this.barChartColors[3].backgroundColor = data.graphcolorlist[3].backgroundColor;
            //console.log(this.APIbarChartLabels);
            //console.log(this.APIbarChartData);
            //console.log(this.APIbarChartColors);
        }, error => { this.errorMessage = error })
    }

    public barChartOptions: any = {
        scaleShowVerticalLines: false,
        responsive: true,
        scaleShowValues: true,
        scaleValuePaddingX: 5,
        scaleValuePaddingY: 5,
        scales: {
            yAxes: [{
                ticks: {
                    beginAtZero: true,
                    maxTicksLimit: 20,
                    callback: function (value: any) {
                        return value + ' days';
                    }
                }
            }]
        }
        //animation: {
        //    onComplete: function () {
        //        var chartInstance = this.chart,
        //            ctx = chartInstance.ctx;
        //        ctx.textAlign = 'center';
        //        ctx.textBaseline = 'bottom';
        //        this.data.datasets.forEach(function (dataset: any, i: number) {
        //            var meta = chartInstance.controller.getDatasetMeta(i);
        //            meta.data.forEach(function (bar:any, index:number) {
        //                var data = dataset.data[index];
        //                if (data != null)
        //                ctx.fillText(data, bar._model.x, bar._model.y - 5);
        //            });
        //        });
        //    }
        //}
    };
    public barChartLabels: string[] = [];
    public barChartType: string = 'bar';
    public barChartLegend: boolean = true;

    public barChartData: any[] = [];
        
    //       [ { data:  [65, 28, 68, 45, 72], label: 'Projected' },
    //        { data: [52, 0, 0, 0, 48], label: 'InProgress' },
    //        { data: [0, 34, 0, 70, 0], label: 'Delay' },
    //        { data: [0, 0, 62, 0, 0], label: 'Complete' },
            
        
    //    //{ data: [28], label: 'Late' },
    //    //{ data: [68], label: 'OnTrack' },
    //    //{ data: [52], label: 'OnTrack' },
    //    //{ data: [72], label: 'Late' },
    //    //{ data: [79], label: 'OnTrack' },
    //    //{ data: [88], label: 'Late' },
    //    //{ data: [45], label: 'OnTrack' },
    //    //{ data: [28], label: 'OnTrack' },
    //    //{ data: [95], label: 'Late' },
    //    //{ data: [87], label: 'OnTrack' },
    //    //{ data: [33], label: 'OnTrack' },
    //    //{ data: [59], label: 'OnTrack' }
        
    //];

    // events
    public chartClicked(e: any): void {
        console.log(e);
    }

    public chartHovered(e: any): void {
        console.log(e);
    }


    cancel() {
        this._location.back();
    }

    public barChartColors: any[] = [];
    //[
    //    { backgroundColor: ['#F4DE8D', '#F4DE8D', '#F4DE8D', '#F4DE8D', '#F4DE8D'] },
    //    { backgroundColor: ['#7BBFEA', '#7BBFEA', '#7BBFEA', '#7BBFEA', '#7BBFEA']},
    //    { backgroundColor: ['#FF0000', '#FF0000', '#FF0000', '#FF0000', '#FF0000'] },
    //    { backgroundColor: ['#78C87A', '#78C87A', '#78C87A', '#78C87A', '#78C87A']  }
        
    //    //{ backgroundColor: '#FF0000' },
    //    //{ backgroundColor: '#78C87A' },
    //    //{ backgroundColor: '#78C87A' },
    //    //{ backgroundColor: '#FF0000' },
    //    //{ backgroundColor: '#78C87A' },
    //    //{ backgroundColor: '#FF0000' },
    //    //{ backgroundColor: '#78C87A' },
    //    //{ backgroundColor: '#78C87A' },
    //    //{ backgroundColor: '#FF0000' },
    //    //{ backgroundColor: '#78C87A' },
    //    //{ backgroundColor: '#78C87A' },
    //    //{ backgroundColor: '#78C87A' },
    //];

    public randomize(): void {
        // Only Change 3 values
        let data = [
            Math.round(Math.random() * 100),
            59,
            80,
            (Math.random() * 100),
            56,
            (Math.random() * 100),
            40];
        let clone = JSON.parse(JSON.stringify(this.barChartData));
        clone[0].data = data;
        this.barChartData = clone;
        /**
         * (My guess), for Angular to recognize the change in the dataset
         * it has to change the dataset variable directly,
         * so one way around it, is to clone the data, change it and then
         * assign it;
         */
    }

}