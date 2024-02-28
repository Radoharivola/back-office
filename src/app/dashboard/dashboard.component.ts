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

    this.isAdmin = this.userservice.isLoggedIn();
    if (!this.isAdmin) {
      Promise.all([
        this.spinner.show(),
        this.fetchTodaysRdv(),
        this.fetchThisWeeksRdv(),
        this.fetchTodaysDoneRdv(),
        this.fetchWs(),
      ]).then(() => {
        this.spinner.hide();
      }).catch(error => {
        console.error('Error fetching data:', error);
        this.spinner.hide();
      });

    }
    Promise.all([
      this.spinner.show(),
      this.nbrRdvPDPM(this.currentYear, this.currentMonth), // Corrected here
      this.caPDPM(this.currentYear, this.currentMonth),
      this.nbrRdvPMPY(this.currentYear),
      this.caPMPY(this.currentYear),
      this.benefits(this.currentYear),
      this.workTime(this.currentYear, this.currentMonth)
    ]).then(() => {
      this.spinner.hide();
    }).catch(error => {
      console.error('Error fetching data:', error);
      this.spinner.hide();
    });

    this.monthRdvPDPM = this.currentMonth;
    this.yearRdvPDPM = this.currentYear;

    this.yearRdvPMPY = this.currentYear;

    this.monthCaPDPM = this.currentMonth;
    this.yearCaPDPM = this.currentYear;

    this.yearCaPMPY = this.currentYear;

    this.yearBenefits = this.currentYear;

    this.yearWT = this.currentYear;
    this.monthWT = this.currentMonth;

  }

  monthRdvPDPM: number;
  yearRdvPDPM: number;
  refreshRdvPDPM() {
    Promise.all([this.spinner.show(), this.nbrRdvPDPM(this.yearRdvPDPM, this.monthRdvPDPM)]).then(() => {
      this.spinner.hide();
    }).catch((error) => {
      console.error('error fetching data:', error);
    })
  }

  yearRdvPMPY: number;
  refreshRdvPMPY() {
    Promise.all([this.spinner.show(), this.nbrRdvPMPY(this.yearRdvPMPY)]).then(() => {
      this.spinner.hide();
    }).catch((error) => {
      console.error('error fetching data:', error);
    })
  }

  monthCaPDPM: number;
  yearCaPDPM: number;
  refreshCaPDPM() {
    Promise.all([this.spinner.show(), this.caPDPM(this.yearCaPDPM, this.monthCaPDPM)]).then(() => {
      this.spinner.hide();
    }).catch((error) => {
      console.error('error fetching data:', error);
    })
  }

  yearCaPMPY: number;
  refreshCaPMPY() {
    Promise.all([this.spinner.show(), this.caPMPY(this.yearCaPMPY)]).then(() => {
      this.spinner.hide();
    }).catch((error) => {
      console.error('error fetching data:', error);
    })
  }
  yearBenefits: number;
  refreshYearBenefits() {
    Promise.all([this.spinner.show(), this.benefits(this.yearBenefits)]).then(() => {
      this.spinner.hide();
    }).catch((error) => {
      console.error('error fetching data:', error);
    })
  }
  benefits(year: number) {
    return new Promise<void>((resolve, reject) => {

      this.statservice.getBenefits(year).subscribe(res => {
        const data = res.body.monthlyBenefits;
        var labels = [];
        var series = [];
        data.forEach((d) => {
          labels.push(d.month);
          series.push(d.benefits);
        })

        this.initBenefits(labels, series);
        resolve();
      }, err => {
        reject();
        console.log(err);
      });
    })
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
    Promise.all([this.spinner.show(), this.workTime(this.yearWT, this.monthWT)]).then(() => {
      this.spinner.hide();
    }).catch((error) => {
      console.error('error fetching data:', error);
    })
  }
  workTime(year: number, month: number) {
    return new Promise<void>((resolve, reject) => {

      this.statservice.getWorkTime(year, month).subscribe(res => {
        const data = res.body.result;
        var labels = [];
        var series = [];
        data.forEach((d) => {
          labels.push(d.employee);
          series.push(d.averageWorkTime);
        })

        this.initWorkTime(labels, series);
        resolve();
      }, err => {
        reject();
        console.log(err);
      });
    })
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
    return new Promise<void>((resolve, reject) => {

      this.statservice.get(year, month).subscribe(res => {
        const data = res.body.appointmentsCounts;
        var labels = [];
        var series = [];
        data.forEach((d) => {
          labels.push(d.day);
          series.push(d.appointmentsCount);
        })

        this.initrdvPDPM(labels, series);
        resolve();
      }, err => {
        reject();
        console.log(err);
      });
    })
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
    return new Promise<void>((resolve, reject) => {

      this.statservice.get(year, '').subscribe(res => {
        console.log(res);
        const data = res.body.appointmentsCountsByMonth;
        var labels = [];
        var series = [];
        data.forEach((d) => {
          labels.push(d.month);
          series.push(d.appointmentsCount);
        })

        this.initrdvPMPY(labels, series);
        resolve();
      }, err => {
        reject();
        console.log(err);
      });
    })
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
    return new Promise<void>((resolve, reject) => {

      this.statservice.getCa(year, month).subscribe(res => {
        const data = res.body.turnoverByDay;

        var labels = [];
        var series = [];
        data.forEach((d) => {
          labels.push(d.day);
          series.push(d.dailyTurnover);
        })

        this.initCaPDPM(labels, series);
        resolve();
      }, err => {
        reject();
        console.log(err);
      });
    })
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
    return new Promise<void>((resolve, reject) => {

      this.statservice.getCa(year, '').subscribe(res => {
        const data = res.body.turnoverByMonth;

        var labels = [];
        var series = [];
        data.forEach((d) => {
          labels.push(d.month);
          series.push(d.monthlyTurnover);
        })

        this.initCaPMPY(labels, series);
        resolve();
      }, err => {
        reject();
        console.log(err);
      });
    })
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
    return new Promise<void>((resolve, reject) => {

      const today = new Date();
      today.setHours(0, 0, 0, 0);
      // Set dateInit to today's date
      const dateInit = today.toISOString();

      // Set dateFin to today's date at 23:59:59
      today.setHours(23, 59, 59, 999);
      const dateFin = today.toISOString();
      this.rdvservice.getRdv({ 'dateInit': dateInit, 'dateFin': dateFin, 'limit': 100, 'page': 1, 'dateSort': this.todayDateSort, 'done': false }).subscribe(response => {
        this.todaysRdv = response.body.rdvs;
        resolve();
      },
        error => {
          reject();
          console.log(error);
          // Unauthorized error, redirect to login page
          this.router.navigate(['/login']); // Adjust the route as per your application
        });
    })
  }

  fetchTodaysDoneRdv() {
    return new Promise<void>((resolve, reject) => {

      const today = new Date();
      today.setHours(0, 0, 0, 0);
      // Set dateInit to today's date
      const dateInit = today.toISOString();

      // Set dateFin to today's date at 23:59:59
      today.setHours(23, 59, 59, 999);
      const dateFin = today.toISOString();
      this.rdvservice.getRdv({ 'dateInit': dateInit, 'dateFin': dateFin, 'limit': 100, 'page': 1, 'dateSort': this.todayDoneDateSort, 'done': true }).subscribe(response => {

        this.todaysDoneRdv = response.body.rdvs;
        var comission = 0;
        this.todaysDoneRdv.forEach(today => {
          today.services.forEach(service => {
            comission = service.price * service.commission / 100;
          });
        });
        this.commission = comission;
        resolve();
      }, error => {
        reject();
        console.log(error);
        // Unauthorized error, redirect to login page
        this.router.navigate(['/login']); // Adjust the route as per your application
      });
    })
  }

  fetchWs() {
    return new Promise<void>((resolve, reject) => {

      this.wsservice.getMyWs().subscribe(response => {
        this.ws = response.body.ws;
        resolve();
      }, error => {
        reject();
        console.log(error);
      })
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
    return new Promise<void>((resolve, reject) => {

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
      this.rdvservice.getRdv({ 'dateInit': dateInit, 'dateFin': dateFin, 'limit': 100, 'page': 1, 'dateSort': this.weekDateSort, 'done': false }).subscribe(response => {
        this.weeksRdv = response.body.rdvs;
        resolve();
      },
        error => {
          reject();
          console.log(error);
          // Unauthorized error, redirect to login page
          this.router.navigate(['/login']); // Adjust the route as per your application
        });
    })
  }

  toggleCheckbox(checked: boolean, rdv: object) {
    rdv['done'] = checked;
    this.update(rdv);
  }

  update(rdv: object) {
    this.spinner.show();
    this.rdvservice.update({ 'data': rdv, 'id': rdv['_id'] }).subscribe(response => {
      this.fetchTodaysDoneRdv();
      this.fetchTodaysRdv();
      this.spinner.hide();
    }, error => {
      console.log(error);
      this.router.navigate(['/login']);
    });
  }
}
