import { Component, OnInit } from '@angular/core';

declare const $: any;
declare interface RouteInfo {
    path: string;
    title: string;
    icon: string;
    class: string;
}
export const ROUTES: RouteInfo[] = [
    { path: '/dashboard', title: 'Dashboard',  icon: 'dashboard', class: '' },
    //user related
    { path: '/user-profile', title: 'Mon Profile',  icon:'person', class: '' },
    { path: '/employees/list', title: 'Employés',  icon:'content_paste', class: '' },
    //end
    //offer related
    { path: '/offers/list', title: 'Offres',  icon:'star', class: '' },
    //end
    //services related
    { path: '/services/list', title: 'Services',  icon:'list', class: '' },
    //end
    //achats related
    { path: '/achats/list', title: 'Achats',  icon:'library_books', class: '' },
    // //end
    // { path: '/table-list', title: 'Table List',  icon:'content_paste', class: '' },
    // { path: '/typography', title: 'Typography',  icon:'library_books', class: '' },
    // { path: '/notifications', title: 'Notifications',  icon:'notifications', class: '' },
    // { path: '/upgrade', title: 'Upgrade to PRO',  icon:'unarchive', class: 'active-pro' },
];

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent implements OnInit {
  menuItems: any[];

  constructor() { }

  ngOnInit() {
    this.menuItems = ROUTES.filter(menuItem => menuItem);
  }
  isMobileMenu() {
      if ($(window).width() > 991) {
          return false;
      }
      return true;
  };
}
