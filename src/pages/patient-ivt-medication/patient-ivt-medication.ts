import { Component} from '@angular/core';
import {App, NavController, NavParams, ActionSheetController, LoadingController, AlertController, ViewController } from 'ionic-angular';

import { WebApiProvider } from '../../providers/web-api/web-api';
import { UtilitiesProvider } from '../../providers/utilities/utilities';

@Component({
  selector: 'page-patient-ivt-medication',
  templateUrl: 'patient-ivt-medication.html',
})
export class PatientIvtMedicationPage {
  userData: any = {};
  usertokenData: any = {};
  addPatientMedicationData: any = {};
  patientId: any = null;
  patientWeight: any = null;
  medicationType: any = null;
  doseValue : any = null;
  disableWeightField: boolean = false;
  
  currentDate: any = null;
  currentLocalDate: any = null;

  constructor(public navCtrl: NavController, public navParams: NavParams, public utilities: UtilitiesProvider, public webApi: WebApiProvider, private actionSheetCtrl: ActionSheetController, private loadingCtrl: LoadingController, public alertCtrl: AlertController, public viewCtrl: ViewController, public appCtrl: App,) {
    this.userData = this.utilities.getLocalObject("userData");
    this.usertokenData = {
      "userId": this.userData.user_id,
      "userToken": this.userData.token
    };
    this.addPatientMedicationData = {

    };
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad PatientIvtMedicationPage');
  }

  getCurrentTime(){
    this.addPatientMedicationData.door_to_needle_time = this.currentLocalDate;
  }

  getDoseValues(){
    if(this.medicationType === "rtPA"){
      this.doseValue = 0.9;

      let total_dose = this.doseValue * this.patientWeight;

      if(total_dose > 90){
        total_dose = 90;
      }
      let bolus_dose = (total_dose * 10) / 100;
      let infusion_dose = total_dose - bolus_dose;
      
      this.addPatientMedicationData = {
        "medicine" : this.medicationType,
        "dose_value" : this.doseValue,
        "patient_weight" : this.patientWeight,
        "total_dose" : total_dose.toFixed(2),
        "bolus_dose" : bolus_dose.toFixed(2),
        "infusion_dose" : infusion_dose.toFixed(2),
        "door_to_needle_time" : this.addPatientMedicationData.door_to_needle_time ,
      };

    }else{
      this.doseValue = 0.25;
      let total_dose = this.doseValue * this.patientWeight;
      if(total_dose > 25){
        total_dose = 25;
      }
      this.addPatientMedicationData = {
        "medicine" : this.medicationType,
        "dose_value" : this.doseValue,
        "patient_weight" : this.patientWeight,
        "total_dose" : total_dose.toFixed(2),
        "door_to_needle_time" : this.addPatientMedicationData.door_to_needle_time ,
      };
    }
  }


  ionViewWillEnter(){
    this.addPatientMedicationData = this.navParams.get("patientMedicationData");
    console.log(JSON.stringify(this.addPatientMedicationData, null, "\t"));

    if(!this.addPatientMedicationData.medicine || this.addPatientMedicationData.medicine === null){
        this.showMedicatiomTypeAlert();        
    }else{  
      this.disableWeightField = true;
      this.medicationType = this.addPatientMedicationData.medicine;
    }
    this.patientId = this.navParams.get("patientId");  
    this.patientWeight = this.navParams.get("patientWeight"); 

    console.log("Patient Weight: "+this.navParams.get("patientWeight"));
  
    if(this.addPatientMedicationData.patient_weight){
      this.patientWeight = this.addPatientMedicationData.patient_weight;
    }

    if(!this.currentLocalDate){
      this.currentLocalDate = new Date();
      this.currentLocalDate.setMinutes(new Date().getMinutes()+330);
      this.currentLocalDate = this.currentLocalDate.toISOString(); 
    }
    
    // if(this.addPatientMedicationData.door_to_needle_time === undefined || this.addPatientMedicationData.door_to_needle_time === null){
    //     // console.log(this.addPatientMedicationData.door_to_needle_time);
    //     this.addPatientMedicationData.door_to_needle_time = this.currentLocalDate;
    // }else{
    //   return false;
    // }

    this.getDoseValues();
  }

  closeModal(){
    this.viewCtrl.dismiss();
  }

  showMedicatiomTypeAlert(){
    let alert = this.alertCtrl.create({
      enableBackdropDismiss : false,
      cssClass: 'custom-alert'
    });    
    alert.setTitle('Choose Medication');

    alert.addInput({
      type: 'radio',
      label: 'rtPA',
      value: 'rtPA',
      checked: false
    });

    alert.addInput({
      type: 'radio',
      label: 'TNK',
      value: 'TNK',
      checked: false
    });

    alert.addButton({
      role: 'cancel',
      text: 'Cancel',
      cssClass: 'default',
      handler: data => {
        // this.utilities.showToast("Please choose a medication first!");
        // return false;
        // alert.dismiss();
        this.closeModal();
      }
    });
    alert.addButton({
      text: 'Choose',
      cssClass : 'success',
      handler: data => {
          if(!data){
              this.utilities.showToast("Please choose a medication");
              return false;
          }
          this.medicationType = data;
          this.getDoseValues();
      }
    });
    alert.present();
  }

  showAlertforNeedleTime(){
    let alert = this.alertCtrl.create({
      title: "Needle Time",
      message: 'Are you starting IVT Bolus?',
      cssClass : 'custom-alert',
      buttons: [
        {
          text: 'No',
          role: 'cancel',
          cssClass : 'default',
          handler: () => {
            this.addPatientMedicationData.door_to_needle_time = null;
            this.savePatientMedications();
          }
        },
        {

          text: 'Yes!',
          cssClass : 'success',
          handler: () => {
              if(this.addPatientMedicationData.door_to_needle_time === undefined || this.addPatientMedicationData.door_to_needle_time === null){                  
                  this.addPatientMedicationData.door_to_needle_time = this.currentLocalDate;
                  this.savePatientMedications();
              }else{
                return false;
              }
          }
        }
      ]
    });
    alert.present(); 
  }

  savePatientMedications(){    
    this.utilities.showLoading("Please wait...");  
    this.addPatientMedicationData.patient_id = this.patientId;
    this.addPatientMedicationData.patient_weight = this.patientWeight;

    this.webApi.updatePatientMedications(this.usertokenData, this.addPatientMedicationData).then((result) => {
        this.utilities.hideLoading();    
        setTimeout(() => {
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
