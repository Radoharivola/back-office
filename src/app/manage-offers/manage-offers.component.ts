
import { Component, OnInit } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { OfferService } from 'app/services/offer.service';
declare var $: any;
import { NgxSpinnerService } from "ngx-spinner";


@Component({
  selector: 'app-manage-offers',
  templateUrl: './manage-offers.component.html',
  styleUrls: ['./manage-offers.component.scss']
})
export class ManageOffersComponent implements OnInit {
  sortBy: string = 'lastName';
  sortOrder: number = 1;
  searchString: string = '';

  offers: any[];
  constructor(private spinner: NgxSpinnerService, private router: Router, private offerservice: OfferService) { }

  ngOnInit(): void {
    this.fetchoffers();
  }
  navigateToAnotherPage() {
    // Navigate to another page when the button is clicked
    this.router.navigate(['/offers/new']); // Replace 'your-other-page' with the route path of the page you want to navigate to
  }

  navigateToUpdate(id: string) {
    // Navigate to another page when the button is clicked
    this.router.navigate(['/offers/update', id]); // Replace 'your-other-page' with the route path of the page you want to navigate to
  }

  fetchoffers() {
    this.spinner.show();
    this.offerservice.getOffers({ 'searchString': this.searchString, 'sortBy': this.sortBy, 'sortOrder': this.sortOrder }).subscribe(data => {
      this.offers = data.body.offers;
      this.spinner.hide();
      console.log(data);
    }, error => {
      localStorage.removeItem('token');
      localStorage.removeItem('username');
      this.router.navigate(['/login']);
      console.log(error);
    })
  }
  setSort(arg0: string) {
    console.log(this.sortOrder);
    this.sortOrder = -1 * this.sortOrder;
    this.sortBy = arg0;
    this.fetchoffers();
  }
  updateSearchString(input: string) {
    this.searchString = input;
    this.fetchoffers();
  }
  delete(id: string) 
  {
    this.spinner.show();
    this.offerservice.delete({ id: id }).subscribe(data => {
      console.log(data);
      this.spinner.hide();
      this.fetchoffers();
      this.showNotification('Offre supprimée', 'success')
    }, error => {
      this.showNotification('Oups', 'danger')

      console.log(error);
    })
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
