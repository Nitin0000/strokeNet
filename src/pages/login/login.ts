import { Component } from '@angular/core';
import { NavController, NavParams, MenuController, AlertController, Platform, Events } from 'ionic-angular';
import { PatientsListPage } from '../patients-list/patients-list';
import { WebApiProvider } from '../../providers/web-api/web-api';

import { AuthServiceProvider } from '../../providers/auth-service/auth-service';
import { UtilitiesProvider } from '../../providers/utilities/utilities';
import { OneSignal } from '@ionic-native/onesignal';
import { DashboardPage } from '../dashboard/dashboard';



@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
})
export class LoginPage {
  currentSection: any = "login";
  login_type: any = "login_hospital";
  register_type: any = "register_hospital";

  loginData: any = { "email_address": null, "password": null, "onesignal_userid": null };
  registerData: any = { "first_name": null, "last_name": null, "email_address": null, "password": null, "hub_id": null, "center_id": null, "user_department": null, "user_role": null, "onesignal_userid": null };
  forgotPasswordData: any = { "email_address": null };

  mobileLoginData: any = { "mobile_number": null, "onesignal_userid": null };

  sendOTPData: any = { "phone_number": null };
  verifyOTPData: any = { "phone_number": null, "otp_code": null, "message_api_code": null, "onesignal_userid": null };

  hubs: any = {};
  centers: any = {};
  globalSettings: any = {};
  userData: any = {};
  currentDepartment: string = null;
  currentRoles: any = {};


  constructor(public navCtrl: NavController, public navParams: NavParams, public webApi: WebApiProvider, public menuCtrl: MenuController, public authService: AuthServiceProvider, public utilities: UtilitiesProvider, private platform: Platform, public events: Events, private oneSignal: OneSignal, public alertCtrl: AlertController) {

  }

  ionViewWillEnter() {
    this.getCenters();
    this.getHubs();
    this.getGlobalSettings();
  }

  getGlobalSettings() {
    this.webApi.getGlobalSettings().then((result) => {
      this.globalSettings = result['data'];
    }, (err) => {
      this.utilities.hideLoading();
      if (err.error.data && err.error.data.message) {
        this.utilities.showAlert("error", err.error.data.message);
      }
    });
  }

  getHubs() {
    this.webApi.getHubs().then((result) => {
      this.hubs = result['data'];
    }, (err) => {
      this.utilities.hideLoading();
      if (err.error.data && err.error.data.message) {
        this.utilities.showAlert("error", err.error.data.message);
      }
    });
  }

  getCenters() {
    this.webApi.getCenters().then((result) => {
      this.centers = result['data'];
    }, (err) => {
      this.utilities.hideLoading();
      if (err.error.data && err.error.data.message) {
        this.utilities.showAlert("error", err.error.data.message);
      }
    });
  }

  ionViewDidEnter() {
    this.menuCtrl.swipeEnable(false);
  }

  doLogin() {
    this.utilities.showLoading("Please wait...");

    this.oneSignal.getIds().then(ids => {
      this.utilities.setLocalItem("OneSignaluserId", ids.userId);
      this.utilities.setLocalItem("OneSignalpushToken", ids.pushToken);
      this.loginData.onesignal_userid = ids.userId;

      this.authService.login(this.loginData).then((result) => {
        this.utilities.setLocalObject("userData", result['data']);
        this.userData = result['data'];
        this.utilities.setLocalItem("isLoggedIn", true);
        this.platform.ready().then(() => {
          this.userData = this.utilities.getLocalObject("userData");
        });
        setTimeout(() => {
          this.utilities.hideLoading();
          this.loginData = { "user_type": null, "email_address": null, "password": null };
          this.events.publish('check:LoggedIn');
          this.menuCtrl.swipeEnable(true);
        }, 1000);

      }, (err) => {
        this.utilities.hideLoading();
        if (err.error.data && err.error.data.message) {
          this.utilities.showAlert("error", err.error.data.message);
        }
      });

    });
  }



  presentEnterOTPCodePrompt() {
    let alert = this.alertCtrl.create({
      title: 'Enter OTP',
      enableBackdropDismiss: false,
      cssClass: 'custom-alert',
      message: 'Please enter OTP sent to your mobile number: ' + this.registerData.phone_number,
      inputs: [
        {
          name: 'otp',
          placeholder: 'Enter OTP'
        },
      ],
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          cssClass: 'default',
          handler: data => {
            console.log('Cancel clicked');
          }
        },
        {
          text: 'Resend OTP',
          role: 'cancel',
          cssClass: 'primary',
          handler: data => {
            setTimeout(() => {
              this.sendOTP();
            }, 200);
          }
        },
        {
          text: 'Verify & Login',
          cssClass: 'success',
          handler: data => {
            if (data.otp && data.otp !== "") {
              this.verifyOTPData.otp_code = data.otp;
              this.verifyOTP();
            } else {
              return false;
            }
          }
        }
      ]
    });
    alert.present();
  }

  sendOTP() {
    this.sendOTPData.phone_number = this.registerData.phone_number;
    this.utilities.showLoading("Please wait....");
    this.webApi.sendOTPCode(this.sendOTPData).then((data) => {
      if (data['data'] && data['data']['message'] && data['data']['message'] == "sms_sent") {
        this.utilities.hideLoading();
        this.verifyOTPData.phone_number = this.registerData.phone_number;
        this.verifyOTPData.message_api_code = data['data']['message_data'];
        this.presentEnterOTPCodePrompt();
      }
    }, (err) => {
      this.utilities.hideLoading();
      if (err.error.data && err.error.data.message) {
        this.utilities.showAlert("error", err.error.data.message);
      }
    });
  }

  verifyOTP() {

    // this.oneSignal.getIds().then(ids => {
    // this.utilities.setLocalItem("OneSignaluserId", ids.userId);
    // this.utilities.setLocalItem("OneSignalpushToken", ids.pushToken);
    // this.verifyOTPData.onesignal_userid = ids.userId;

    this.utilities.showLoading("Please wait....");
    this.webApi.verifyOTP(this.verifyOTPData).then((data) => {

      this.utilities.hideLoading();
      if (data['data'] && data['data']['new_user']) {
        setTimeout(() => {
          this.doRegister();
        }, 300);
      } else {
        this.utilities.setLocalObject("userData", data['data']['user_data']);
        this.userData = data['data']['user_data'];
        this.utilities.setLocalItem("isLoggedIn", true);
        this.platform.ready().then(() => {
          this.userData = this.utilities.getLocalObject("userData");
        });
        setTimeout(() => {
          this.utilities.hideLoading();
          this.events.publish('check:LoggedIn');
          this.menuCtrl.swipeEnable(true);
        }, 1000);
      }
    }, (err) => {
      this.utilities.hideLoading();
      if (err.error.data && err.error.data.message) {
        this.utilities.showAlert("error", err.error.data.message);
      }
    });

    // });
  }

  doRegister() {
    this.utilities.showLoading("Please wait....");

    // this.oneSignal.getIds().then(ids => {

    //   this.utilities.setLocalItem("OneSignaluserId", ids.userId);
    //   this.utilities.setLocalItem("OneSignalpushToken", ids.pushToken);
    //   this.registerData.onesignal_userid = ids.userId;

    this.authService.signup(this.registerData).then((data) => {
      if (data['data'] && data['data']['message']) {
        this.utilities.hideLoading();
        this.utilities.showAlert("success", data['data']['message']);
        this.registerData = { "first_name": null, "last_name": null, "email_address": null, "password": null, "center_id": null, "user_department": null, "user_role": null };
        this.currentSection = 'login';
      }
    }, (err) => {
      this.utilities.hideLoading();
      if (err.error.data && err.error.data.message) {
        this.utilities.showAlert("error", err.error.data.message);
      }
    });
    // });
  }

  doForgotPassword() {
    this.utilities.showLoading("Please wait...");
    this.authService.forgotpassword(this.forgotPasswordData).then((result) => {
      this.utilities.hideLoading();
      if (result && result['data'] && result['data']['message']) {
        this.utilities.showAlert("success", result['data']['message']);
        this.forgotPasswordData = { "email_address": null };
        this.showSection('login');
      }
    }, (err) => {
      this.utilities.hideLoading();
      if (err.error.data && err.error.data) {
        this.utilities.showAlert("error", err.error.data.message);
      }
    });
  }

  setRoles() {
    this.registerData.user_department = this.currentDepartment['name'];
    this.currentRoles = this.currentDepartment['roles'];
  }


  showSection(section) {
    this.currentSection = section;
  }

  gotoPatientsListPage() {
    this.navCtrl.push(PatientsListPage);
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad LoginPage');
  }

}
