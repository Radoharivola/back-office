import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { WsService } from 'app/services/ws.service';
declare var $: any;

@Component({
  selector: 'app-update-ws',
  templateUrl: './update-ws.component.html',
  styleUrls: ['./update-ws.component.scss']
})
export class UpdateWsComponent implements OnInit {

  employeeId: any;
  ws: any;
  files: any;
  id: any;
  dayOfWeek: {
    debutHour: any;
    debutMin: any;
    finHour: any;
    finMin: any; day: string, editMode: boolean
  }[] = [
      { day: 'Monday', editMode: false, debutHour: 0, debutMin: 0, finHour: 0, finMin: 0 },
      { day: 'Tuesday', editMode: false, debutHour: 0, debutMin: 0, finHour: 0, finMin: 0 },
      { day: 'Wednesday', editMode: false, debutHour: 0, debutMin: 0, finHour: 0, finMin: 0 },
      { day: 'Thursday', editMode: false, debutHour: 0, debutMin: 0, finHour: 0, finMin: 0 },
      { day: 'Friday', editMode: false, debutHour: 0, debutMin: 0, finHour: 0, finMin: 0 },
      { day: 'Saturday', editMode: false, debutHour: 0, debutMin: 0, finHour: 0, finMin: 0 },
      { day: 'Sunday', editMode: false, debutHour: 0, debutMin: 0, finHour: 0, finMin: 0 }
    ];
  constructor(private wsservice: WsService, private route: ActivatedRoute) { }
  showNotification(message: string, type: string) {
    // const type = ['','info','success','warning','danger'];

    const color = Math.floor((Math.random() * 4) + 1);

    $.notify({
      icon: "notifications",
      message: message

    }, {
      type: type,
      timer: 4000,
      placement: {
        from: 'top',
        align: 'center'
      },
      template: '<div data-notify="container" class="col-xl-4 col-lg-4 col-11 col-sm-4 col-md-4 alert alert-{0} alert-with-icon" role="alert">' +
        '<button mat-button  type="button" aria-hidden="true" class="close mat-button" data-notify="dismiss">  <i class="material-icons">close</i></button>' +
        '<i class="material-icons" data-notify="icon">notifications</i> ' +
        '<span data-notify="title">{1}</span> ' +
        '<span data-notify="message">{2}</span>' +
        '<div class="progress" data-notify="progressbar">' +
        '<div class="progress-bar progress-bar-{0}" role="progressbar" aria-valuenow="0" aria-valuemin="0" aria-valuemax="100" style="width: 0%;"></div>' +
        '</div>' +
        '<a href="{3}" target="{4}" data-notify="url"></a>' +
        '</div>'
    });
  }
  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.employeeId = params['id'];
      this.wsservice.getWs(this.employeeId).subscribe(data => {
        this.ws = data.body.ws;
        this.id = data.body.id;

        this.dayOfWeek = this.dayOfWeek.map(day => {
          const schedule = this.ws.find(item => item.day.toLowerCase() === day.day.toLowerCase());
          if (schedule) {
            return {
              ...day,
              editMode: true,
              debutHour: schedule.debutHour,
              debutMin: schedule.debutMin,
              finHour: schedule.finHour,
              finMin: schedule.finMin,
              _id: schedule._id
            };
          } else {
            return day;
          }
        });
        console.log(this.id);
      }, err => {
        // localStorage.removeItem('token');
        // localStorage.removeItem('username');
        // this.router.navigate(['/login']);
        this.id = 'nooo';
        console.log(err);
      });
    });
  }
  test(e) {
    console.log(e.target.event);
  }
  enregister() {
    // Filter the dayOfWeek array to get only the objects with editMode=true
    const modifiedDays = this.dayOfWeek.filter(day => day.editMode);

    // Transform the objects to have only dayOfWeek, startTime, and endTime properties
    const weeklySchedule = modifiedDays.map(day => {
      return {
        dayOfWeek: day.day,
        startTime: `${day.debutHour}:${day.debutMin}`,
        endTime: `${day.finHour}:${day.finMin}`,
      };
    });
    const data = {
      weeklySchedule: weeklySchedule,
      employeeId: this.employeeId
    }
    this.wsservice.update(this.id, data).subscribe(res => {
      console.log(res);
      this.id = res.body.ws._id;
      this.showNotification('Horaires de travail mis à jour', 'success');

    }, err => {
      this.showNotification(err.error.error, 'danger');

      console.log(err);
    });

  }

  updateHours(day: any, prop: string, value: number) {
    if (prop === 'debutHour') {
      // Ensure debutHour is less than finHour
      if (value >= day.finHour) {
        day.finHour = value + 1; // Set finHour to be one hour more than debutHour
      }
    } else if (prop === 'finHour') {
      // Ensure finHour is greater than debutHour
      if (value <= day.debutHour) {
        day.debutHour = value - 1; // Set debutHour to be one hour less than finHour
      }
    }
  }

}
