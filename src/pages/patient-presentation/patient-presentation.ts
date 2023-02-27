import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';

import { WebApiProvider } from '../../providers/web-api/web-api';
import { UtilitiesProvider } from '../../providers/utilities/utilities';

@Component({
  selector: 'page-patient-presentation',
  templateUrl: 'patient-presentation.html',
})
export class PatientPresentationPage {
  userData: any = {};
  usertokenData: any = {};

  presentationData: any;
  patientId: any;

  constructor(public navCtrl: NavController, public navParams: NavParams, public utilities: UtilitiesProvider, public webApi: WebApiProvider) {
    this.userData = this.utilities.getLocalObject("userData");
    this.usertokenData = {
      "userId": this.userData.user_id,
      "userToken": this.userData.token
    };
  }

  ionViewWillEnter(){
    this.presentationData = this.navParams.get("presentationData");
    this.patientId = this.navParams.get("patientId");
  }

  doUpdatePatientPresentationData() {
    this.presentationData.patient_id = this.patientId;
    console.log(JSON.stringify(this.presentationData, null, "\t"));

    this.utilities.showLoading("Please wait...");
    this.webApi.updatePatientPresentation(this.usertokenData, this.presentationData).then((result) => {
      this.utilities.hideLoading();
      if (result['data'] && result['data']) {
        this.utilities.showToast(result['data'], 'top');
      }
    }, (err) => {
      this.utilities.hideLoading();
      if (err.error.data && err.error.data.message) {
        this.utilities.showAlert("error", err.error.data.message);
      }
    });
  }
  ionViewDidLoad() {
    console.log('ionViewDidLoad PatientBriefHistoryPage');
  }
}
