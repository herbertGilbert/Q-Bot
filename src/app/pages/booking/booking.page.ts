import { ApiService } from './../../services/api/api.service';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NavExtrasService } from '../../services/nav/nav-extras.service';


import {
  CalendarModal,
  CalendarModalOptions,
  CalendarResult
} from 'ion2-calendar';


import * as moment from 'moment';
import { ModalController, AlertController, NavController } from '@ionic/angular';

@Component({
  selector: 'app-booking',
  templateUrl: './booking.page.html',
  styleUrls: ['./booking.page.scss'],
})
export class BookingPage implements OnInit {
  booking: any = {};
  newBooking: boolean;
  duration: any = 30;
  dateFormat = 'yyyy-MM-DDTHH:mm';
  startMin = '09:00';
  startMax = '16:30';
  endMin = '09:30';
  endMax = '17:00';
  info: any = [
    'You can book from Monday to Friday',
    'Your booking duration should be either 30 mins or 1 hour',
    'Your can from 09:00 to 17:00'
  ];

  constructor(private params: NavExtrasService,
    public alertController: AlertController,
    private api: ApiService,
    private navCtrl: NavController,
    private route: ActivatedRoute, private modalCtrl: ModalController) { }

  ngOnInit() {
    this.newBooking = JSON.parse(this.route.snapshot.paramMap.get('newBooking'));
    if (!this.newBooking) {
      this.booking = this.params.getExtras();
      this.duration = moment.duration(moment(this.booking.bookingEnd).diff(moment(this.booking.bookingStart))).asMinutes();
    } else {
      this.initDefaults();
    }
  }
  updateStarTime() {
    this.booking.bookingStart = moment(this.booking.bookingEnd).subtract(this.duration, 'minute').format(this.dateFormat);
  }
  initDefaults() {
    let sDate = moment().set({ hour: 9, minute: 0 });

    if (sDate.day() == 6) {
      sDate.add(2, 'day');
    } else if (sDate.day() == 7) {
      sDate.add(1, 'day');
    }
    this.booking.bookingStart = sDate.format(this.dateFormat);
    this.updateEndTime();
  }
  durationChanged(e) {
    if (this.duration == 30) {
      this.startMax = '16:30';
      this.endMin = '09:30';

    } else if (this.duration == 60) {

      this.startMax = '16:00';
      this.endMin = '10:00';

    }
    this.updateEndTime();
  }
  updateEndTime() {

    this.booking.bookingEnd = moment(this.booking.bookingStart).add(this.duration, 'minute').format(this.dateFormat);

    // Adjust time
    const maxTime = moment('17:00', 'HH:mm');
    const calculatedEndTime = moment(this.booking.bookingEnd).format('HH:mm');
    const changedEndTime = moment(calculatedEndTime, 'HH:mm');

    if (changedEndTime.isAfter(maxTime)) {
      this.booking.bookingEnd = moment(this.booking.bookingEnd)
        .set({
          hour: 17,
          minute: 0
        });

      this.api.showTost("We have adjusted the your timings to the nearest available time", 'warning');
    }

    const minTime = moment('09:00', 'HH:mm');
    const calculatedStartTime = moment(this.booking.bookingStart).format('HH:mm');
    const changedStartTime = moment(calculatedStartTime, 'HH:mm');

    if (changedStartTime.isBefore(minTime)) {

      this.booking.bookingStart = moment(this.booking.bookingStart)
        .set({
          hour: 9,
          minute: 0
        });
      this.api.showTost("We have adjusted the your timings to the nearest available time", 'warning');
    }

  }
  update() {
    this.api.showLoading().then(ld => {
      ld.present();
      this.api.put(this.booking).subscribe(
        (res) => {
          this.api.hideLoading();
          this.api.showTost("Booking updated successfully");
          this.navCtrl.navigateBack('/home');

        },
        (err) => {
          this.api.hideLoading();
        }
      );
    })
  }
  cancel() {
    this.api.showLoading().then(ld => {
      ld.present();
      this.api.delete(this.booking).subscribe(
        (res) => {
          this.api.hideLoading();
          this.api.showTost("Booking has been canceled");
          this.navCtrl.navigateBack('/home');
        },
        (err) => {
          this.api.hideLoading();
        }
      );
    })
  }
  save() {
    this.booking.bookingId = moment().unix();
    this.api.showLoading().then(ld => {
      ld.present();
      this.api.post(this.booking).subscribe(
        (res) => {
          this.api.hideLoading();
          this.api.showTost("Booking saved successfully");
          this.navCtrl.navigateBack('/home');
        },
        (err) => {
          this.api.hideLoading();
        }
      );
    })


  }

  async openCalendar() {
    const options: CalendarModalOptions = {
      title: 'Select date', disableWeeks: [0, 6]
    };

    const myCalendar = await this.modalCtrl.create({
      component: CalendarModal,
      componentProps: { options }
    });

    myCalendar.present();

    const event: any = await myCalendar.onDidDismiss();
    const date: CalendarResult = event.data;

    if (date) {
      this.booking.bookingStart = moment(date.dateObj).set({ hour: 9, minute: 0 }).format(this.dateFormat);
      this.updateEndTime();
    }
  }



  async showTip(index) {

    const alert = await this.alertController.create({
      //cssClass: 'my-custom-class',
      header: 'Information',
      //subHeader: 'Subtitle',
      message: this.info[index],
      buttons: ['OK']
    });

    await alert.present();

  }

}




