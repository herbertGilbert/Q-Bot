import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { LoadingController, ToastController } from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  update(booking: any) {
    throw new Error("Method not implemented.");
  }
  baseUrl = 'https://qotp4gi9x5.execute-api.eu-west-2.amazonaws.com/Test/SGVyYmVydCBCcnVubw==';
  httpOptions: any;


  constructor(public http: HttpClient, private loadingController: LoadingController,
    public toastController: ToastController) {
    this.httpOptions = {
      headers: new HttpHeaders({
        Accept: 'application/json',
        'Content-Type': 'application/json'
      })
    };
  }
  showLoading() {
    return this.loadingController.create({
      message: 'Please wait...',
      duration: 20000
    });
  }

  hideLoading() {
    this.loadingController.dismiss();
  }

  public get(options?: any) {
    return this.http.get(this.baseUrl, options);
  }

  public put(params) {
    return this.http.put(
      this.baseUrl + '/' + params.bookingId,
      params,
      this.httpOptions);
  }
  public delete(params) {
    return this.http.delete(
      this.baseUrl + '/' + params.bookingId,
      params);
  }
  async showTost(messageStr: string, toastColor: string = 'success') {
    const toast = await this.toastController.create({
      message: messageStr,
      color: toastColor,
      duration: 3000
    });
    toast.present();
  }

  post(params) {
    return this.http.post(
      this.baseUrl,
      params,
      this.httpOptions);
  }


}
