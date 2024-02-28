import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UserService } from 'app/services/user.service';
import { ServiceService } from 'app/services/service.service';
import { OfferService } from 'app/services/offer.service';
declare var $: any;
import { NgxSpinnerService } from "ngx-spinner";



@Component({
  selector: 'app-new-offer',
  templateUrl: './new-offer.component.html',
  styleUrls: ['./new-offer.component.scss']
})
export class NewOfferComponent implements OnInit {
  offerForm: FormGroup;
  unmatched: boolean = false;
  services: any[] = [];
  fileEmpty: boolean = false;
  selectedServices: any[] = [];

  constructor(private spinner: NgxSpinnerService, private fb: FormBuilder, private userservice: UserService, private serviceservice: ServiceService, private offerservice:OfferService) { }

  ngOnInit(): void {

    this.fetchServices();
    this.initForm();
  }
  initForm() {
    this.offerForm = this.fb.group({
      description: ['', Validators.required],
      dateDebut: ['', Validators.required],
      dateFin: ['', Validators.required],
      reduction: ['', Validators.required]
    });
  }

  fetchServices() {
    this.spinner.show();
    this.serviceservice.getServices().subscribe(response => {
      this.services = response.body.services;
      this.spinner.hide();
      console.log(response);
    }, error => {
      console.log(error);
    })
  }
  onSubmit() {


    if (this.offerForm.valid) {
      // if (this.offerForm.value.motDePasse != this.offerForm.value.confirmerMotDePasse){ //   this.unmatched = true;// }
      const data = {
        "dateDebut": this.offerForm.value.dateDebut,
        "dateFin": this.offerForm.value.dateFin,
        "services": this.selectedServices,
        "reduction": this.offerForm.value.reduction,
        "description": this.offerForm.value.description,

      };
      this.spinner.show();
      this.offerservice.new({ data:data }).subscribe(
        response => {
          // this.error = false;
          // this.success = true;
          // setTimeout(() => {
          //   this.success = false;
          // }, 5000);
          // this.message = response.message;
          this.spinner.hide();
          this.showNotification('Nouvelle offre ajoutée', 'success');

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
    } else {
      this.markFormGroupTouched(this.offerForm);
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
  test(value: any) {
    console.log(value);
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
  updateSelectedServices(service: any, isChecked: boolean) {
    if (isChecked) {
      this.selectedServices.push(service);
      console.log(this.selectedServices);
    } else {
      const index = this.selectedServices.indexOf(service);
      if (index !== -1) {
        this.selectedServices.splice(index, 1);
      }
    }
  }
}
