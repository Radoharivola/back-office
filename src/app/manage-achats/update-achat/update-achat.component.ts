import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
declare var $: any;
import { DatePipe } from '@angular/common';
import { Observable } from 'rxjs';
import { AchatsService } from 'app/services/achats.service';
import { NgxSpinnerService } from "ngx-spinner";

@Component({
  selector: 'app-update-achat',
  templateUrl: './update-achat.component.html',
  styleUrls: ['./update-achat.component.scss']
})
export class UpdateAchatComponent implements OnInit {

  achatId: string;
  achatsForm: FormGroup;
  achats: any;

  constructor(private spinner: NgxSpinnerService, private router: Router, private fb: FormBuilder, private achatsService: AchatsService, private route: ActivatedRoute, private datePipe: DatePipe) { }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.achatId = params['id'];
      this.achatsService.getAchat({ id: this.achatId }).subscribe(data => {
        console.log(data);
        this.achats = data.body.achat;
        this.initForm();
      }, err => {
        console.log(err);
      });

    });
  }

  initForm() {
    const formattedDate = this.datePipe.transform(this.achats.date, 'yyyy-MM-dd HH:mm:ss');

    this.achatsForm = this.fb.group({
      date: [formattedDate, Validators.required],
      motif: [this.achats.motif, Validators.required],
      price: [this.achats.price, Validators.required]
    });
  }

  onSubmit() {
    if (this.achatsForm.valid) {
      // if (this.employeeForm.value.motDePasse != this.employeeForm.value.confirmerMotDePasse){ //   this.unmatched = true;// }

      const data = {
        "date": this.achatsForm.value.date,
        "motif": this.achatsForm.value.motif,
        "price": this.achatsForm.value.price,

      };
      this.spinner.show();
      this.achatsService.update({ 'data': data, 'id': this.achatId }).subscribe(
        response => {
          // this.error = false;
          // this.success = true;
          // setTimeout(() => {
          //   this.success = false;
          // }, 5000);
          // this.message = response.message;
          this.spinner.hide();
          this.showNotification('Achat mise à jour', 'success');

          console.log(response);
        },
        error => {
          // this.success = false;
          // this.error = true;
          // setTimeout(() => {
          //   this.error = false;
          // }, 5000);
          // this.message = error.error.message;
          this.showNotification(error.error.error, 'danger');

          console.log("foryyyy");
        }
      );
      this.router.navigate(['/achats/list']);
    } else {
      this.markFormGroupTouched(this.achatsForm);
    }
  }

  markFormGroupTouched(formGroup: FormGroup) {
    Object.values(formGroup.controls).forEach(control => {
      control.markAsTouched();
      if (control instanceof FormGroup) {
        this.markFormGroupTouched(control);
      }
    });
  }

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

}
