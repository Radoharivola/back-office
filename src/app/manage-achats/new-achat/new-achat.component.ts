import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AchatsService } from 'app/services/achats.service';
import { DatePipe } from '@angular/common';
import { Router, NavigationEnd } from '@angular/router';
declare var $: any;


@Component({
  selector: 'app-new-achat',
  templateUrl: './new-achat.component.html',
  styleUrls: ['./new-achat.component.scss']
})
export class NewAchatComponent implements OnInit {

  achatsForm: FormGroup;

  constructor(private router: Router, private fb: FormBuilder, private achatsService: AchatsService, private datePipe: DatePipe) { }

  ngOnInit(): void {
    this.achatsForm = this.fb.group({
      date: ['', Validators.required],
      motif: ['', Validators.required],
      price: ['', Validators.required]
    });
  }

  onSubmit() {
    //console.log("Why ?????????????");
    if (this.achatsForm.valid) {
      //console.log("valid");

      // if (this.serviceForm.value.motDePasse != this.serviceForm.value.confirmerMotDePasse){ //   this.unmatched = true;// }
      // const formData = new FormData();
      // formData.append('name', this.serviceForm.value.nom);
      // formData.append('duration', this.serviceForm.value.duration);
      // formData.append('price', this.serviceForm.value.price);
      // formData.append('commission', this.serviceForm.value.commission);
      // formData.append('description', this.serviceForm.value.description);

      const data = {
        date: this.achatsForm.value.date,
        motif: this.achatsForm.value.motif,
        price: this.achatsForm.value.price,
      }
      console.log(data);

      this.achatsService.newAchats({ data: data }).subscribe(
        response => {
          // this.error = false;
          // this.success = true;
          // setTimeout(() => {
          //   this.success = false;
          // }, 5000);
          // this.message = response.message;
          this.showNotification('Nouvel Achat ajouté', 'success');
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
          console.log(error);
        }
      );
      this.router.navigate(['/achats/list']);
    } else {
      console.log(this.achatsForm);

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
