import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';

import { WebApiProvider } from '../../providers/web-api/web-api';
import { UtilitiesProvider } from '../../providers/utilities/utilities';

import { ChangePasswordPage } from '../change-password/change-password';

@Component({
  selector: 'page-edit-profile',
  templateUrl: 'edit-profile.html',
})
export class EditProfilePage {
  userData: any = {};
  usertokenData: any = {};


  constructor(public navCtrl: NavController, public navParams: NavParams, public utilities: UtilitiesProvider, public webApi: WebApiProvider) {
    this.userData = this.utilities.getLocalObject("userData");
    this.usertokenData = {
      "userId": this.userData.user_id,
      "userToken": this.userData.token
    };
  }

  gotoChangePasswordPage(){
    this.navCtrl.push(ChangePasswordPage);
  }  

  updateProfile(){
    let data = {
      'first_name' : this.userData.first_name,
      'last_name' : this.userData.last_name,
      'email_address' : this.userData.email_address,
      'phone_number' : this.userData.phone_number,
    }
    this.utilities.showLoading("Please wait...");
    this.webApi.updateProfile(this.usertokenData, data).then((result) => {
      this.utilities.hideLoading();
      if (result['data'] && result['data']) {

        this.utilities.setLocalObject("userData", result['data']);
        this.userData = result['data']; 

        this.utilities.showToast("Profile was updated successfully", 'top');
      }
    }, (err) => {
      this.utilities.hideLoading();
      if (err.error.data && err.error.data) {
        this.utilities.showAlert("error", err.error.data);
      }
    });

  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad EditProfilePage');
  }

}
