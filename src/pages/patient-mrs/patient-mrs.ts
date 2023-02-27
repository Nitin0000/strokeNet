import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { UtilitiesProvider } from '../../providers/utilities/utilities';
import { WebApiProvider } from '../../providers/web-api/web-api';

@Component({
  selector: 'page-patient-mrs',
  templateUrl: 'patient-mrs.html',
})
export class PatientMrsPage {
  selectedTab: string = 'discharge';
  userData: any = {};
  usertokenData: any = {};

  mrsData: any;
  patientId: any;
  currentMRSselection: any = null;
  currentMRSPoints: any = 0;

  constructor(public navCtrl: NavController, public navParams: NavParams, public utilities: UtilitiesProvider, public webApi: WebApiProvider) {
    this.userData = this.utilities.getLocalObject("userData");
    this.usertokenData = {
      "userId": this.userData.user_id,
      "userToken": this.userData.token
    };
  }
  
  ionViewWillEnter(){
    this.mrsData = this.navParams.get("mrsData");
    this.patientId = this.navParams.get("patientId");   
    this.currentMRSselection = this.mrsData[this.selectedTab].mrs_options;
    this.currentMRSPoints = this.mrsData[this.selectedTab].mrs_points;
  }

  changeTab(tab) {
    this.selectedTab = tab;
    this.currentMRSselection = this.mrsData[this.selectedTab].mrs_options;
    this.currentMRSPoints = this.mrsData[this.selectedTab].mrs_points;
  }


  updateMRSofPatient(value, points){
    this.currentMRSselection = value;
    this.currentMRSPoints = points;
    
    let mrsData = {
      "patient_id" : this.patientId,
      "mrs_time" : this.selectedTab,
      "mrs_options" : this.currentMRSselection,
      "mrs_points": points
    }    

    // this.utilities.showLoading("Please wait...");
    this.webApi.updateMRSofPatient(this.usertokenData, mrsData).then((result) => {
      // this.utilities.hideLoading();
      if (result['data'] && result['data']) {
        this.mrsData = result['data']['mrs_data'];
        this.utilities.showToast(result['data']['message'], 'bottom');        
      }
    }, (err) => {
      // this.utilities.hideLoading();
      if (err.error.data && err.error.data.message) {
        this.utilities.showAlert("error", err.error.data.message);
      }
    });    
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad PatientMrsPage');
  }

}
