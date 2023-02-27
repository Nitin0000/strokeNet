import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';

import { WebApiProvider } from '../../providers/web-api/web-api';
import { UtilitiesProvider } from '../../providers/utilities/utilities';


@Component({
  selector: 'page-change-password',
  templateUrl: 'change-password.html',
})
export class ChangePasswordPage {
  userData: any = {};
  usertokenData: any = {};

  changePasswordData : any = {
    'old_password' : null,
    'new_password' : null,
    'repeat_password' : null
  };

  constructor(public navCtrl: NavController, public navParams: NavParams, public utilities: UtilitiesProvider, public webApi: WebApiProvider) {
    this.userData = this.utilities.getLocalObject("userData");

    this.usertokenData = {
      "userId": this.userData.user_id,
      "userToken": this.userData.token
    };
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ChangePasswordPage');
  }

  changePassword(){
    this.utilities.showLoading("Please wait...");
    this.webApi.changePassword(this.usertokenData, this.changePasswordData).then((result) => {

      if (result['data']) {
        this.utilities.hideLoading();
        this.utilities.showToast(result['data']);
        this.changePasswordData = {
          'old_password' : null,
          'new_password' : null,
          'repeat_password' : null
        };
        this.navCtrl.pop();
      }

    }, (err) => {
      this.utilities.hideLoading();
      if (err.error.data && err.error.data) {
        this.utilities.showAlert("error", err.error.data);
      }
    });
  }

}
