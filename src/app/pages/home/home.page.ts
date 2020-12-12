import { NavExtrasService } from '../../services/nav/nav-extras.service';
import { Component } from '@angular/core';
import { ApiService } from '../../services/api/api.service';
import * as moment from 'moment';
import { Router } from '@angular/router';
@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {
  bookings: any = [];
  moMent = moment;
  constructor(private api: ApiService, private router: Router, private navParams: NavExtrasService) {
  }

  ionViewDidEnter() {
    this.api.showLoading().then(ld => {
      ld.present();
      this.api.get().subscribe(res => {
        this.bookings = res;
        this.api.hideLoading();
      });
    })

  }
  openNavDetailsPage(bookingObj, e) {
    this.navParams.setExtras(bookingObj);
    this.router.navigate(['/booking', { newBooking: false }]);
  }
  newBooking() {
    this.router.navigate(['/booking', { newBooking: true }]);
  }


}
