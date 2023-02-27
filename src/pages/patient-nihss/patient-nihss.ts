import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { PatientNihssCalculatorPage } from '../patient-nihss-calculator/patient-nihss-calculator';

import { UtilitiesProvider } from '../../providers/utilities/utilities';
import { WebApiProvider } from '../../providers/web-api/web-api';

@Component({
  selector: 'page-patient-nihss',
  templateUrl: 'patient-nihss.html',
})
export class PatientNihssPage {
  selectedTab: string = 'admission';
  userData: any = {};
  usertokenData: any = {};
  
  currentNIHSSvalue: any = 0;
  currentNIHSSoptions: any = 0;

  nihssData: any;
  patientId: any

  constructor(public navCtrl: NavController, public navParams: NavParams, public utilities: UtilitiesProvider, public webApi: WebApiProvider) {
    this.userData = this.utilities.getLocalObject("userData");
    this.usertokenData = {
      "userId": this.userData.user_id,
      "userToken": this.userData.token
    };
  }

  ionViewWillEnter(){
    this.nihssData = this.navParams.get("nihssData");
    this.patientId = this.navParams.get("patientId");

    this.getSinglePatientDetails(this.patientId);

    this.currentNIHSSvalue = this.nihssData[this.selectedTab].nihss_value;
    this.currentNIHSSoptions = this.nihssData[this.selectedTab].nihss_options;
  }

  changeTab(tab) {
    this.selectedTab = tab;
    this.currentNIHSSvalue = this.nihssData[this.selectedTab].nihss_value;
    this.currentNIHSSoptions = this.nihssData[this.selectedTab].nihss_options;
  }
  ionViewDidLoad() {
    console.log('ionViewDidLoad PatientNihssPage');
  }

 
  getSinglePatientDetails(patientId){
    this.webApi.getSinglePatient(this.usertokenData, patientId).then((result) => {
      if (result['data'] && result['data']) {
       this.nihssData = result['data']['patient_nihss'];

        this.currentNIHSSvalue = this.nihssData[this.selectedTab].nihss_value;
        this.currentNIHSSoptions = this.nihssData[this.selectedTab].nihss_options;

      }
    }, (err) => {
      if (err.error.data && err.error.data.message) {
        this.utilities.showAlert("error", err.error.data.message);
      }
    });
  }

  updateNIHSSScore(){
    let nihssData = {
      "patient_id" : this.patientId,
      "nihss_time" : this.selectedTab,
      "nihss_value" : this.currentNIHSSvalue,
      "nihss_options" : this.currentNIHSSoptions
    };
    this.webApi.updateNIHSSofPatient(this.usertokenData, nihssData).then((result) => {
        if (result['data'] && result['data']) {
          this.currentNIHSSoptions = result['data']['nihss_data']['nihss_options'];
          this.utilities.showToast(result['data']['message'], 'bottom'); 
        }
      }, (err) => {
        if (err.error.data && err.error.data.message) {
          this.utilities.showAlert("error", err.error.data.message);
        }
      }); 
  }

  openNIHSSCalculator(){
    this.navCtrl.push(PatientNihssCalculatorPage, {'patientId' : this.patientId, 'nihssTime' : this.selectedTab,'nihssData' :  this.nihssData[this.selectedTab].nihss_options});
  }

}
