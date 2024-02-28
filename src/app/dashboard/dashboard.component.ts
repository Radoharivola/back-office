import { Component, OnInit } from '@angular/core';
import { RdvService } from 'app/services/rdv.service';
import * as Chartist from 'chartist';
import { Router } from '@angular/router';
import { UserService } from '../services/user.service';
import { WsService } from 'app/services/ws.service';
import { StatService } from 'app/services/stat.service';
import { NgxSpinnerService } from "ngx-spinner";

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  monthList: { index: number, month: string }[] = [
    { index: 1, month: 'janvier' },
    { index: 2, month: 'février' },
    { index: 3, month: 'mars' },
    { index: 4, month: 'avril' },
    { index: 5, month: 'mai' },
    { index: 6, month: 'juin' },
    { index: 7, month: 'juillet' },
    { index: 8, month: 'août' },
    { index: 9, month: 'septembre' },
    { index: 10, month: 'octobre' },
    { index: 11, month: 'novembre' },
    { index: 12, month: 'décembre' }
  ];
  currentYear: number = new Date().getFullYear();
  currentMonth: number = new Date().getMonth() + 1;
  commission: number;

  // Generate the years array from the current year to 2024
  years: number[];
  todaysRdv: any[];
  todaysDoneRdv: any[];
  weeksRdv: any[];
  weekDateSort: number = 1;
  todayDateSort: number = 1;
  todayDoneDateSort: number = 1;
  ws: any[] = [];
  isAdmin: boolean = false;
  constructor(private spinner: NgxSpinnerService, private rdvservice: RdvService, private router: Router, private userservice: UserService, private wsservice: WsService, private statservice: StatService) { }
  startAnimationForLineChart(chart) {
    let seq: any, delays: any, durations: any;
    seq = 0;
    delays = 80;
    durations = 500;

    chart.on('draw', function (data) {
      if (data.type === 'line' || data.type === 'area') {
        data.element.animate({
          d: {
            begin: 600,
            dur: 700,
            from: data.path.clone().scale(1, 0).translate(0, data.chartRect.height()).stringify(),
            to: data.path.clone().stringify(),
            easing: Chartist.Svg.Easing.easeOutQuint
          }
        });
      } else if (data.type === 'point') {
        seq++;
        data.element.animate({
          opacity: {
            begin: seq * delays,
            dur: durations,
            from: 0,
            to: 1,
            easing: 'ease'
          }
        });
      }
    });

    seq = 0;
  };
  startAnimationForBarChart(chart) {
    let seq2: any, delays2: any, durations2: any;

    seq2 = 0;
    delays2 = 80;
    durations2 = 500;
    chart.on('draw', function (data) {
      if (data.type === 'bar') {
        seq2++;
        data.element.animate({
          opacity: {
            begin: seq2 * delays2,
            dur: durations2,
            from: 0,
            to: 1,
            easing: 'ease'
          }
        });
      }
    });

    seq2 = 0;
  };
  ngOnInit() {
    this.years = Array.from({ length: this.currentYear - 2010 }, (_, index) => this.currentYear - index);
    this.fetchTodaysRdv();
    this.fetchThisWeeksRdv();
    this.fetchTodaysDoneRdv();
    this.fetchWs();

    this.nbrRdvPDPM(this.currentYear, this.currentMonth);
    this.caPDPM(this.currentYear, this.currentMonth);
    this.nbrRdvPMPY(this.currentYear);
    this.caPMPY(this.currentYear);
    this.benefits(this.currentYear);
    this.workTime(this.currentYear, this.currentMonth);
    this.monthRdvPDPM = this.currentMonth;
    this.yearRdvPDPM = this.currentYear;

    this.yearRdvPMPY = this.currentYear;

    this.monthCaPDPM = this.currentMonth;
    this.yearCaPDPM = this.currentYear;

    this.yearCaPMPY = this.currentYear;

    this.yearBenefits = this.currentYear;

    this.yearWT = this.currentYear;
    this.monthWT = this.currentMonth;

    this.isAdmin = this.userservice.isLoggedIn();
  }

  monthRdvPDPM: number;
  yearRdvPDPM: number;
  refreshRdvPDPM() {
    this.nbrRdvPDPM(this.yearRdvPDPM, this.monthRdvPDPM);
  }

  yearRdvPMPY: number;
  refreshRdvPMPY() {
    this.nbrRdvPMPY(this.yearRdvPMPY);
  }

  monthCaPDPM: number;
  yearCaPDPM: number;
  refreshCaPDPM() {
    this.caPDPM(this.yearCaPDPM, this.monthCaPDPM);
  }

  yearCaPMPY: number;
  refreshCaPMPY() {
    this.caPMPY(this.yearCaPMPY);
  }
  yearBenefits: number;
  refreshYearBenefits() {
    this.benefits(this.yearBenefits);
  }
  benefits(year: number) {

    this.spinner.show()
    this.statservice.getBenefits(year).subscribe(res => {
      this.spinner.hide();
      const data = res.body.monthlyBenefits;
      var labels = [];
      var series = [];
      data.forEach((d) => {
        labels.push(d.month);
        series.push(d.benefits);
      })

      this.initBenefits(labels, series);
    }, err => {
      this.spinner.hide();
      console.log(err);
    });
  }
  initBenefits(labels, series) {
    const dataDailySalesChart: any = {
      labels: labels,
      series: [
        series
      ]
    };

    const optionsDailySalesChart: any = {
      lineSmooth: Chartist.Interpolation.cardinal({
        tension: 0
      }),
      low: 0,
      high: Math.max(...series), // creative tim: we recommend you to set the high sa the biggest value + something for a better look
      chartPadding: { top: 0, right: 0, bottom: 10, left: 20 },
    }

    var dailySalesChart = new Chartist.Line('#benefits', dataDailySalesChart, optionsDailySalesChart);

    this.startAnimationForLineChart(dailySalesChart);
  }


  monthWT: number;
  yearWT: number;
  refreshWT() {
    this.workTime(this.yearWT, this.monthWT);
  }
  workTime(year: number, month: number) {
    this.spinner.show()
    this.statservice.getWorkTime(year, month).subscribe(res => {
      this.spinner.hide();
      const data = res.body.result;
      var labels = [];
      var series = [];
      data.forEach((d) => {
        labels.push(d.employee);
        series.push(d.averageWorkTime);
      })

      this.initWorkTime(labels, series);
    }, err => {
      this.spinner.hide();
      console.log(err);
    });
  }
  initWorkTime(labels, series) {
    var datawebsiteViewsChart = {
      labels: labels,
      series: [
        series

      ]
    };
    var optionswebsiteViewsChart = {
      axisX: {
        showGrid: true
      },
      low: 0,
      high: Math.max(...series),
      chartPadding: { top: 30, right: 5, bottom: 0, left: 20 },
    };
    var responsiveOptions: any[] = [
      ['screen and (max-width: 640px)', {
        seriesBarDistance: 5,
        axisX: {
          labelInterpolationFnc: function (value) {
            return value[0];
          }
        }
      }]
    ];
    var websiteViewsChart = new Chartist.Bar('#workTime', datawebsiteViewsChart, optionswebsiteViewsChart, responsiveOptions);

    //start animation for the Emails Subscription Chart
    this.startAnimationForBarChart(websiteViewsChart);
  }

  nbrRdvPDPM(year: number, month?: any) {
    this.spinner.show()
    this.statservice.get(year, month).subscribe(res => {
      this.spinner.hide();
      const data = res.body.appointmentsCounts;
      var labels = [];
      var series = [];
      data.forEach((d) => {
        labels.push(d.day);
        series.push(d.appointmentsCount);
      })

      this.initrdvPDPM(labels, series);
    }, err => {
      this.spinner.hide();
      console.log(err);
    });
  }
  initrdvPDPM(labels, series) {
    const dataDailySalesChart: any = {
      labels: labels,
      series: [
        series
      ]
    };

    const optionsDailySalesChart: any = {
      lineSmooth: Chartist.Interpolation.cardinal({
        tension: 0
      }),
      low: 0,
      high: Math.max(...series), // creative tim: we recommend you to set the high sa the biggest value + something for a better look
      chartPadding: { top: 30, right: 0, bottom: 0, left: 20 },
    }

    var dailySalesChart = new Chartist.Line('#dailySalesChart', dataDailySalesChart, optionsDailySalesChart);

    this.startAnimationForLineChart(dailySalesChart);
  }

  nbrRdvPMPY(year: number) {
    this.spinner.show()
    this.statservice.get(year, '').subscribe(res => {
      this.spinner.hide();
      console.log(res);
      const data = res.body.appointmentsCountsByMonth;
      var labels = [];
      var series = [];
      data.forEach((d) => {
        labels.push(d.month);
        series.push(d.appointmentsCount);
      })

      this.initrdvPMPY(labels, series);
    }, err => {
      this.spinner.hide();
      console.log(err);
    });
  }
  initrdvPMPY(labels, series) {
    var datawebsiteViewsChart = {
      labels: labels,
      series: [
        series

      ]
    };
    var optionswebsiteViewsChart = {
      axisX: {
        showGrid: true
      },
      low: 0,
      high: Math.max(...series),
      chartPadding: { top: 30, right: 5, bottom: 0, left: 20 }
    };
    var responsiveOptions: any[] = [
      ['screen and (max-width: 640px)', {
        seriesBarDistance: 5,
        axisX: {
          labelInterpolationFnc: function (value) {
            return value[0];
          }
        }
      }]
    ];
    var websiteViewsChart = new Chartist.Bar('#websiteViewsChart', datawebsiteViewsChart, optionswebsiteViewsChart, responsiveOptions);

    //start animation for the Emails Subscription Chart
    this.startAnimationForBarChart(websiteViewsChart);
  }

  caPDPM(year: number, month?: any) {
    this.spinner.show()
    this.statservice.getCa(year, month).subscribe(res => {
      this.spinner.hide();
      const data = res.body.turnoverByDay;

      var labels = [];
      var series = [];
      data.forEach((d) => {
        labels.push(d.day);
        series.push(d.dailyTurnover);
      })

      this.initCaPDPM(labels, series);
    }, err => {
      this.spinner.hide();
      console.log(err);
    });
  }
  initCaPDPM(labels, series) {
    const dataCompletedTasksChart: any = {
      labels: labels,
      series: [
        series
      ]
    };

    const optionsCompletedTasksChart: any = {
      lineSmooth: Chartist.Interpolation.cardinal({
        tension: 0
      }),
      low: Math.min(...series),
      high: Math.max(...series), // creative tim: we recommend you to set the high sa the biggest value + something for a better look
      chartPadding: { top: 30, right: 0, bottom: 10, left: 50 }
    }


    var completedTasksChart = new Chartist.Line('#completedTasksChart', dataCompletedTasksChart, optionsCompletedTasksChart);

    // start animation for the Completed Tasks Chart - Line Chart
    this.startAnimationForLineChart(completedTasksChart);
  }

  caPMPY(year: number) {
    this.spinner.show()
    this.statservice.getCa(year, '').subscribe(res => {
      this.spinner.hide();
      const data = res.body.turnoverByMonth;

      var labels = [];
      var series = [];
      data.forEach((d) => {
        labels.push(d.month);
        series.push(d.monthlyTurnover);
      })

      this.initCaPMPY(labels, series);
    }, err => {
      this.spinner.hide();
      console.log(err);
    });
  }
  initCaPMPY(labels, series) {
    const dataCompletedTasksChart: any = {
      labels: labels,
      series: [
        series
      ]
    };

    const optionsCompletedTasksChart: any = {
      lineSmooth: Chartist.Interpolation.cardinal({
        tension: 0
      }),
      low: Math.min(...series),
      high: Math.max(...series), // creative tim: we recommend you to set the high sa the biggest value + something for a better look
      chartPadding: { top: 30, right: 0, bottom: 10, left: 50 }
    }
    var completedTasksChart = new Chartist.Line('#capmpy', dataCompletedTasksChart, optionsCompletedTasksChart);

    // start animation for the Completed Tasks Chart - Line Chart
    this.startAnimationForLineChart(completedTasksChart);
  }

  fetchTodaysRdv() {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    // Set dateInit to today's date
    const dateInit = today.toISOString();

    // Set dateFin to today's date at 23:59:59
    today.setHours(23, 59, 59, 999);
    const dateFin = today.toISOString();
    this.spinner.show()
    this.rdvservice.getRdv({ 'dateInit': dateInit, 'dateFin': dateFin, 'limit': 100, 'page': 1, 'dateSort': this.todayDateSort, 'done': false }).subscribe(response => {
      this.spinner.hide();
      this.todaysRdv = response.body.rdvs;
    },
      error => {
        this.spinner.hide();
        console.log(error);
        // Unauthorized error, redirect to login page
        this.router.navigate(['/login']); // Adjust the route as per your application
      });
  }

  fetchTodaysDoneRdv() {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    // Set dateInit to today's date
    const dateInit = today.toISOString();

    // Set dateFin to today's date at 23:59:59
    today.setHours(23, 59, 59, 999);
    const dateFin = today.toISOString();
    this.spinner.show()
    this.rdvservice.getRdv({ 'dateInit': dateInit, 'dateFin': dateFin, 'limit': 100, 'page': 1, 'dateSort': this.todayDoneDateSort, 'done': true }).subscribe(response => {
      this.spinner.hide();
      this.todaysDoneRdv = response.body.rdvs;
      var comission = 0;
      this.todaysDoneRdv.forEach(today => {
        today.services.forEach(service => {
          comission = service.price * service.commission / 100;
        });
      });
      this.commission = comission;
    },
      error => {
        this.spinner.hide();
        console.log(error);
        // Unauthorized error, redirect to login page
        this.router.navigate(['/login']); // Adjust the route as per your application
      });
  }

  fetchWs() {
    this.spinner.show()
    this.wsservice.getMyWs().subscribe(response => {
      this.spinner.hide();
      this.ws = response.body.ws;
    }, error => {
      this.spinner.hide();
      console.log(error);
    })
  }

  flipWeekDateSort() {
    this.weekDateSort = this.weekDateSort * -1;
    this.fetchThisWeeksRdv();
  }

  flipTodayDateSort() {
    this.todayDateSort = this.todayDateSort * -1;
    this.fetchTodaysRdv();
  }

  flipTodayDoneDateSort() {
    this.todayDoneDateSort = this.todayDoneDateSort * -1;
    this.fetchTodaysDoneRdv();
  }

  fetchThisWeeksRdv() {
    const today = new Date();
    const firstDayOfWeek = new Date(today);
    const lastDayOfWeek = new Date(today);

    const dayOfWeek = today.getDay(); // 0 (Sunday) to 6 (Saturday)
    const diff = today.getDate() - dayOfWeek + (dayOfWeek === 0 ? -6 : 1); // Adjust when today is Sunday

    firstDayOfWeek.setDate(diff);
    lastDayOfWeek.setDate(diff + 6);

    // Set time to beginning of the first day
    firstDayOfWeek.setHours(0, 0, 0, 0);
    const dateInit = firstDayOfWeek.toISOString();

    // Set time to end of the last day
    lastDayOfWeek.setHours(23, 59, 59, 999);
    const dateFin = lastDayOfWeek.toISOString();
    this.spinner.show()
    this.rdvservice.getRdv({ 'dateInit': dateInit, 'dateFin': dateFin, 'limit': 100, 'page': 1, 'dateSort': this.weekDateSort, 'done': false }).subscribe(response => {
      this.spinner.hide();
      this.weeksRdv = response.body.rdvs;
    },
      error => {
        this.spinner.hide();
        console.log(error);
        // Unauthorized error, redirect to login page
        this.router.navigate(['/login']); // Adjust the route as per your application
      });
  }

  toggleCheckbox(checked: boolean, rdv: object) {
    rdv['done'] = checked;
    this.update(rdv);
  }

  update(rdv: object) {
    this.spinner.show()
    this.rdvservice.update({ 'data': rdv, 'id': rdv['_id'] }).subscribe(response => {
      this.spinner.hide();
      console.log(response);
      this.fetchTodaysDoneRdv();
      this.fetchTodaysRdv();
    }, error => {
      this.spinner.hide();
      console.log(error);
      this.router.navigate(['/login']);
    });
  }
}
