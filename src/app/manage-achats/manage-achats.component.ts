import { Component, OnInit } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { AchatsService } from 'app/services/achats.service';
import { NgxSpinnerService } from "ngx-spinner";

@Component({
  selector: 'app-manage-achats',
  templateUrl: './manage-achats.component.html',
  styleUrls: ['./manage-achats.component.scss']
})
export class ManageAchatsComponent implements OnInit {

  constructor(private spinner: NgxSpinnerService, private router: Router, private achatsService: AchatsService) { }
  achats: any[];

  ngOnInit(): void {
    this.fetchAchats();
  }

  navigateToAdd() {
    this.router.navigate(['/achats/new']);
  }

  navigateToUpdate(id: string) {
    this.router.navigate(['/achats/update', id]);
  }

  fetchAchats() {
    this.spinner.show();
    this.achatsService.getAchats().subscribe(data => {
      this.achats = data.achats;
      console.log(data);
      this.spinner.hide();

    });
  }

  delete(id: string) {
    this.spinner.show();
    this.achatsService.deleteAchats(id).subscribe(data => {
      console.log(data);
      this.fetchAchats();
      this.spinner.hide();
    }, error => {
      console.log(error);
    })
  }


}
