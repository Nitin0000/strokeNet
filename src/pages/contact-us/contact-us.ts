import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';

import { WebApiProvider } from '../../providers/web-api/web-api';
import { UtilitiesProvider } from '../../providers/utilities/utilities';


@Component({
  selector: 'page-contact-us',
  templateUrl: 'contact-us.html',
})
export class ContactUsPage {
  userData: any = {};
  usertokenData: any = {};

  contactUsData : any = {
    'name' : null,
    'email' : null,
    'phone' : null,
    "message" : null
  };

  constructor(public navCtrl: NavController, public navParams: NavParams, public utilities: UtilitiesProvider, public webApi: WebApiProvider) {
    this.userData = this.utilities.getLocalObject("userData");

    this.usertokenData = {
      "userId": this.userData.user_id,
      "userToken": this.userData.token
    };
  }

  sendContact(){
    this.utilities.showLoading("Please wait...");
    this.webApi.contactUs(this.usertokenData, this.contactUsData).then((result) => {

      if (result['data'] && result['data']['message'] && result['data']['message'] == "request_sent") {
        this.utilities.hideLoading();
       this.utilities.showToast("Thanks for contacting us, one of our representative will contact back you soon!");

       this.contactUsData = {
          'name' : null,
          'email' : null,
          'phone' : null,
          "message" : null
        };
      }

    }, (err) => {
      this.utilities.hideLoading();
      if (err.error.data && err.error.data.message) {
        this.utilities.showAlert("error", err.error.data.message);
      }
    });
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ContactUsPage');
  }

}
