import { Component} from '@angular/core';
import {App, NavController, NavParams, ActionSheetController, LoadingController, AlertController, ModalController, ViewController } from 'ionic-angular';

import { WebApiProvider } from '../../providers/web-api/web-api';
import { UtilitiesProvider } from '../../providers/utilities/utilities';
import { PatientDetailPage } from '../patient-detail/patient-detail';

@Component({
  selector: 'page-patient-scan-times-modal',
  templateUrl: 'patient-scan-times-modal.html',
})
export class PatientScanTimesModalPage {
  userData: any = {};
  usertokenData: any = {};
  addPatientScanTimesData: any = {};
  patientId: any = null;
  currentDate: any = new Date();
  currentLocalDate: any = new Date();
  canLeave: boolean  = false;

  lvo_types = [
    'ICA', 'M1', 'M2', 'M3', 'A1', 'A2', 'A3', 'BA', 'PCA'
  ];

  constructor(public navCtrl: NavController, public navParams: NavParams, public utilities: UtilitiesProvider, public webApi: WebApiProvider, private actionSheetCtrl: ActionSheetController, private loadingCtrl: LoadingController, public alertCtrl: AlertController, public modalCtrl: ModalController, public viewCtrl: ViewController, public appCtrl: App,) {
    this.userData = this.utilities.getLocalObject("userData");
    this.usertokenData = {
      "userId": this.userData.user_id,
      "userToken": this.userData.token
    };

  }
  ionViewDidLoad() {
    console.log('ionViewDidLoad PatientScanTimesModalPage');
  }

  closeModal(){
    this.viewCtrl.dismiss();
  }



  getCurrentTime(scan_type){
    switch(scan_type){
      case 'ct_scan_time': 
        if(this.addPatientScanTimesData.ct_scan_time === undefined || this.addPatientScanTimesData.ct_scan_time === null){
          this.addPatientScanTimesData.ct_scan_time = this.currentLocalDate;
        }else{
          return false;
        }
      break;
      case 'mr_mra_time': 
        if(this.addPatientScanTimesData.mr_mra_time === undefined || this.addPatientScanTimesData.mr_mra_time === null){
          this.addPatientScanTimesData.mr_mra_time = this.currentLocalDate;
        }else{
          return false;
        }
      break;
      case 'dsa_time_completed': 
        if(this.addPatientScanTimesData.dsa_time_completed === undefined || this.addPatientScanTimesData.dsa_time_completed === null){
          this.addPatientScanTimesData.dsa_time_completed = this.currentLocalDate;
        }else{
          return false;
        }
      break;
    }
    
  }

  ionViewWillEnter(){
    this.currentLocalDate.setMinutes(this.currentDate.getMinutes()+330);
    this.currentLocalDate = this.currentLocalDate.toISOString();
    this.addPatientScanTimesData = this.navParams.get("patientScanTimesData");

    if(this.addPatientScanTimesData.lvo_types){
      this.addPatientScanTimesData.lvo_types = this.addPatientScanTimesData.lvo_types.split(",");
    }


    this.patientId = this.navParams.get("patientId");
  }

  ionViewCanLeave() {
      if(this.canLeave){
          //this.viewCtrl.dismiss();
          //this.navCtrl.pop();
      }else{
        this.closeScanTimesModal();
        return false;
      }
  }

  closeScanTimesModal() {
    let alert = this.alertCtrl.create({
    title: "Cancel Editing",
    message: "Are you sure you want to cancel updating the timings?",
    buttons: [
      {
        text: "Continue",
        role: 'cancel',
        handler: () => {
          
        }
      },
      {
        text: "Exit",
        handler: () => {
          this.canLeave = true;
          this.navCtrl.pop();
        }
      }
    ]
  });
  alert.present();  
}

savePatientScanTimes(){
  this.utilities.showLoading("Please wait...");
  this.addPatientScanTimesData.patient_id = this.patientId;

  if(this.addPatientScanTimesData.lvo_types && this.addPatientScanTimesData.lvo_types.length > 0){
    this.addPatientScanTimesData.lvo_types = this.addPatientScanTimesData.lvo_types.join(",");
  }

  this.webApi.updateScanTimesofPatient(this.usertokenData, this.addPatientScanTimesData).then((result) => {
      this.utilities.hideLoading();    
      setTimeout(() => {
        this.canLeave = true;
        if(result['data'] && result['data']['message']){
          this.utilities.showAlert("success", result['data']['message']);
          this.closeModal();
        }
      },200);
  }, (err) => {
    this.utilities.hideLoading();     
    if(err.error.data && err.error.data.message){                   
        this.utilities.showAlert("error",err.error.data.message);   
    }
}); 

}

}
