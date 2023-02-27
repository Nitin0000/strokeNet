import { Component } from '@angular/core';
import { NavController, NavParams, AlertController } from 'ionic-angular';

import { WebApiProvider } from '../../providers/web-api/web-api';
import { UtilitiesProvider } from '../../providers/utilities/utilities';

@Component({
  selector: 'page-patient-basic-details',
  templateUrl: 'patient-basic-details.html',
})
export class PatientBasicDetailsPage {
  userData: any = {};
  usertokenData: any = {};

  basicDetails: any;
  patientId: any;
  comorbidities: any = {};  

  currentDate: any = new Date();
  currentLocalDate: any = new Date();

  fixedValues: any = {
    bp_x: null,
    bp_y: null,
    rbs: null,
    aspects: null,
  }

  constructor(public navCtrl: NavController, public navParams: NavParams, public utilities: UtilitiesProvider, public webApi: WebApiProvider, public alertCtrl:AlertController) {
    this.userData = this.utilities.getLocalObject("userData");
    this.usertokenData = {
      "userId": this.userData.user_id,
      "userToken": this.userData.token
    };
  }

  ionViewWillEnter(){
    this.currentLocalDate.setMinutes(this.currentDate.getMinutes()+330);
    this.currentLocalDate = this.currentLocalDate.toISOString();

    this.basicDetails = this.navParams.get("basicDetails");
    console.log(JSON.stringify(this.basicDetails, null, "\t"));

    this.fixedValues = {
      bp_x: this.basicDetails.bp_x,
      bp_y: this.basicDetails.bp_y,
      rbs: this.basicDetails.rbs,
      aspects: this.basicDetails.aspects,
    }
    console.log(JSON.stringify(this.fixedValues, null, "\t"));

    if(this.basicDetails.co_morbidities){
      this.basicDetails.co_morbidities = this.basicDetails.co_morbidities.split(",");
    }
    this.patientId = this.navParams.get("patientId");
    this.getComorbidities();
  }


  getCurrentTime(){
    if(this.basicDetails.admission_time === undefined || this.basicDetails.admission_time === null){
      this.basicDetails.admission_time = this.currentLocalDate;
    }
  }

  getComorbidities(){
    this.webApi.getComorbidities().then((result) => {
      this.comorbidities = result['data'];
   }, (err) => {
       this.utilities.hideLoading();     
       if(err.error.data && err.error.data.message){                   
           this.utilities.showAlert("error",err.error.data.message);   
       }
   });
  }

  doUpdatePatientBasicData() {
    let alert = this.alertCtrl.create({
      title: "Update Information",
      message: "Are you sure you update the information?",
      buttons: [
        {
          text: "Cancel",
          role: 'cancel',
          handler: () => {
            
          }
        },
        {
          text: "Update",
          handler: () => {
                this.utilities.showLoading("Please wait...");
                this.basicDetails.patient_id = this.patientId;

                if(this.basicDetails.co_morbidities && this.basicDetails.co_morbidities.length > 0){
                  this.basicDetails.co_morbidities = this.basicDetails.co_morbidities.join(",");
                }

                this.webApi.updatePatientBasicData(this.usertokenData, this.basicDetails).then((result) => {
                  this.utilities.hideLoading();
                  if (result['data'] && result['data']) {
                    this.navCtrl.pop();
                    this.utilities.showToast(result['data'], 'top');
                  }
                }, (err) => {
                  this.utilities.hideLoading();
                  if (err.error.data && err.error.data.message) {
                    this.utilities.showAlert("error", err.error.data.message);
                  }
                });
          }
        }
      ]
    });
    alert.present();
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad PatientBasicTestPage');
  }

}
