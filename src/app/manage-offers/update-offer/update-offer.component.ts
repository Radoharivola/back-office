import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { UserService } from 'app/services/user.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { OfferService } from 'app/services/offer.service';
import { ServiceService } from 'app/services/service.service';
declare var $: any;
import { DatePipe } from '@angular/common';
import { NgxSpinnerService } from "ngx-spinner";


@Component({
  selector: 'app-update-offer',
  templateUrl: './update-offer.component.html',
  styleUrls: ['./update-offer.component.scss']
})
export class UpdateOfferComponent implements OnInit {
  offerId: string;
  offerForm: FormGroup;
  unmatched: boolean = false;

  fileEmpty: boolean = false;

  offer: any;

  services: any[] = [];


  selectedServices: any;


  files: File[] = [];
  constructor(private spinner: NgxSpinnerService, private router: Router, private fb: FormBuilder, private offerservice: OfferService, private route: ActivatedRoute, private serviceservice: ServiceService, private datePipe: DatePipe) { }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.offerId = params['id'];
      this.offerservice.get({ id: this.offerId }).subscribe(data => {
        this.offer = data.body.offer;

        this.selectedServices = this.offer.services;
        console.log("selected:"+ this.selectedServices);
        this.fetchServices();
        this.initForm();


      }, err => {
        console.log(err);
      });

    });
  }
  fetchServices() {
    this.spinner.show();

    
    this.serviceservice.getServices().subscribe(response => {
      this.services = response.body.services;
      console.log("services:"+ this.selectedServices);
      this.spinner.hide();
    }, error => {
      console.log(error);
    });
  }
  initForm() {
    const formattedDateDebut = this.datePipe.transform(this.offer.dateDebut, 'yyyy-MM-dd HH:mm:ss');
    const formattedDateFin = this.datePipe.transform(this.offer.dateFin, 'yyyy-MM-dd HH:mm:ss');

    this.offerForm = this.fb.group({
      description: [this.offer.description, Validators.required],
      dateDebut: [formattedDateDebut, Validators.required],
      dateFin: [formattedDateFin, Validators.required],
      reduction: [this.offer.reduction, Validators.required]
    });
  }

  isInSS(service:any):boolean {

    return this.selectedServices.some(selectedService => selectedService._id === service._id);
  }

  updateSelectedServices(service: any, isChecked: boolean) {
    console.log(isChecked);
    if (isChecked) {
      this.selectedServices.push(service);
    } else {
      const index = this.selectedServices.findIndex(selectedService => selectedService._id === service._id);
      if (index !== -1) {
        this.selectedServices.splice(index, 1);
      }
    }
    console.log(this.selectedServices);


  }
  onSubmit() {
    if (this.offerForm.valid) {
      // if (this.employeeForm.value.motDePasse != this.employeeForm.value.confirmerMotDePasse){ //   this.unmatched = true;// }

      const data = {
        "dateDebut": this.offerForm.value.dateDebut,
        "dateFin": this.offerForm.value.dateFin,
        "services": this.selectedServices,
        "reduction": this.offerForm.value.reduction,
        "description": this.offerForm.value.description,

      };
      this.spinner.show();
      this.offerservice.update({ 'data': data, 'id': this.offerId }).subscribe(
        response => {
          // this.error = false;
          // this.success = true;
          // setTimeout(() => {
          //   this.success = false;
          // }, 5000);
          // this.message = response.message;
          this.spinner.hide();
          this.showNotification('Offre mise à jour', 'success');

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
