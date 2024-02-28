import { Component, OnInit } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { ServiceService } from '../services/service.service';
import { NgxSpinnerService } from "ngx-spinner";


@Component({
  selector: 'app-manage-services',
  templateUrl: './manage-services.component.html',
  styleUrls: ['./manage-services.component.scss']
})
export class ManageServicesComponent implements OnInit {

  constructor(private spinner: NgxSpinnerService, private router: Router, private serviceService: ServiceService) { }
  services: any[];

  ngOnInit(): void {
    this.fetchServices();
  }

  navigateToAdd() {
    this.router.navigate(['/services/new']);
  }

  navigateToUpdate(id: string) {
    this.router.navigate(['/services/update', id]);
  }

  fetchServices() {
    this.spinner.show();
    this.serviceService.getServices().subscribe(data => {
      this.services = data.body.services;
      this.spinner.hide();
      console.log(data.services);
    });
  }

  delete(id: string) {
    this.spinner.show();
    this.serviceService.deleteService(id).subscribe(data => {
      console.log(data);   
      this.fetchServices();
      this.spinner.hide();
    }, error => {
      console.log(error);
    })
  }

}
