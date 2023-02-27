import { Component } from '@angular/core';
import { NavController, NavParams, Events} from 'ionic-angular';

import { WebApiProvider } from '../../providers/web-api/web-api';
import { UtilitiesProvider } from '../../providers/utilities/utilities';

import { PatientSummaryPage } from '../patient-summary/patient-summary';
import { PatientDetailPage } from '../patient-detail/patient-detail';
import { AddPatientPage } from '../add-patient/add-patient';
import { BarcodeScanner } from '@ionic-native/barcode-scanner';


@Component({
  selector: 'page-patients-list',
  templateUrl: 'patients-list.html',
})
export class PatientsListPage {
  userData: any = {};
  usertokenData: any = {};

  centers: any = [];

  spokePatients: any = {};
  spokePatientsfilterData: any;

  hubSpokePatients: any = {};
  hubSpokePatientsfilterData: any;

  hubPatients: any = {};
  hubPatientsfilterData: any;

  searchQuery: any = "";

  spoke_patients: boolean = true;
  hub_patients: boolean = false;

  currentCenter: any = "All Centers";

  constructor(public navCtrl: NavController, public navParams: NavParams, public utilities: UtilitiesProvider, public webApi: WebApiProvider, public events: Events, private barcodeScanner: BarcodeScanner) {
    this.userData = this.utilities.getLocalObject("userData");

    if(this.userData.is_hub_user){
      this.spoke_patients = false;
      this.hub_patients = true;
    }else{
      this.spoke_patients = true;
      this.hub_patients = false;
    }

    this.usertokenData = {
      "userId": this.userData.user_id,
      "userToken": this.userData.token
    };
    console.log(JSON.stringify(this.usertokenData, null, "\t"));
    
  }
  changeTab(tab){
    if(tab == "hub"){
      this.spoke_patients = false;
      this.hub_patients = true;
    }else{
      this.spoke_patients = true;
      this.hub_patients = false;
    }
  }

  onCenterChanged(event){
    console.log(event);
    this.currentCenter = event;
  }


  doRefreshPatients(refresher) {
    this.spokePatients = {};
    this.hubPatients = {};
    this.getUserPatients();
    if (refresher) {
      refresher.complete();
    }
  }


  onCancelHubSpokePatients(ev) {
    ev.target.value = '';
    this.hubSpokePatientsfilterData = this.hubSpokePatients.filter((patient) => {
      return patient.name.toLowerCase().indexOf('') > -1;
    });
  }

  searchHubSpokePatients(event) {
    this.hubSpokePatientsfilterData = this.hubSpokePatients.filter((patient) => {
      return patient.patient_code.toLowerCase().indexOf(event.target.value.toLowerCase()) > -1 || patient.name.toLowerCase().indexOf(event.target.value.toLowerCase()) > -1;
    });
  }
  


onCancelSpokePatients(ev) {
  ev.target.value = '';
  this.spokePatientsfilterData = this.spokePatients.filter((patient) => {
    return patient.name.toLowerCase().indexOf('') > -1;
  });
}

searchSpokePatients(event) {
  this.spokePatientsfilterData = this.spokePatients.filter((patient) => {
    return patient.patient_code.toLowerCase().indexOf(event.target.value.toLowerCase()) > -1 || patient.name.toLowerCase().indexOf(event.target.value.toLowerCase()) > -1;
  });
}



  onCancelHubPatients(ev) {
    ev.target.value = '';
    this.hubPatientsfilterData = this.hubPatients.filter((patient) => {
      return patient.patient_code.toLowerCase().indexOf('') > -1;
    });
  }

  searchHubPatients(event) {
    this.hubPatientsfilterData = this.hubPatients.filter((patient) => {
      return patient.patient_code.toLowerCase().indexOf(event.target.value.toLowerCase()) > -1 || patient.name.toLowerCase().indexOf(event.target.value.toLowerCase()) > -1;
    });
  }






  ionViewWillEnter(){
    this.getBackGroundPatients();    
  }

  getUserPatients() {
    this.utilities.showLoading("Loading patients...");
    this.webApi.getUserPatients(this.usertokenData).then((result) => {
      this.utilities.hideLoading();
     
      if (result['data'] && result['data']) {

        this.spokePatients = result['data']['spoke_patients'];
        this.spokePatientsfilterData = this.spokePatients;

        this.hubPatients = result['data']['hub_patients'];
        this.hubPatientsfilterData = this.hubPatients;

        this.hubSpokePatients = result['data']['hub_spoke_patients'];
        this.hubSpokePatientsfilterData = this.hubSpokePatients;


        this.centers = result['data']['centers'];

        // setTimeout(() => {
        //   this.navCtrl.push(PatientDetailPage, {'patientId' : 46});
        // }, 200);
      }
            
    }, (err) => {
      this.utilities.hideLoading();
      this.utilities.checksessionExpiryError(err.error.data.message);
    });
  }

  getBackGroundPatients() {
    this.webApi.getUserPatients(this.usertokenData).then((result) => {     
      if (result['data'] && result['data']) {
        this.spokePatients = result['data']['spoke_patients'];
        this.spokePatientsfilterData = this.spokePatients;
        this.hubPatients = result['data']['hub_patients'];
        this.hubPatientsfilterData = this.hubPatients;
      }
    }, (err) => {
      if (err.error.data && err.error.data.message) {
        this.utilities.checksessionExpiryError(err.error.data.message);        
      }
    });
  }

  ionViewDidLoad() {
    this.getUserPatients();
    console.log('ionViewDidLoad PatientsListPage');
  }

  gotoAddPatientPage() {
    this.navCtrl.push(AddPatientPage);
  }

  checkEditPatientAndGotoPage(check, patientId){
    console.log(check);
    if(check){
      this.gotoPatientDetailPage(patientId);
    }else{
      this.gotoPatientSummaryPage(patientId);
    }
  }


  gotoPatientSummaryPage(patientId) {
    this.navCtrl.push(PatientSummaryPage, { "patientId": patientId });
  }

  gotoPatientDetailPage(patientId) {
    this.navCtrl.push(PatientDetailPage, { "patientId": patientId });
  }


  scanQRCode(){
    console.log("Scan Qr Code");
    this.barcodeScanner.scan().then(barcodeData => {
      console.log('Barcode data', barcodeData);
      if(barcodeData.text && barcodeData.text !== ""){
        let patientCode = barcodeData.text;
        this.utilities.showLoading("Please wait");
        this.webApi.getSinglePatient(this.usertokenData, patientCode).then((result) => {
          if (result['data'] && result['data']) {
              this.utilities.hideLoading();
              if(result['data'] && result['data']['can_edit_details']){
                this.navCtrl.push(PatientDetailPage, {'patientId' : result['data']['patient_id']});
              }else{
                this.navCtrl.push(PatientSummaryPage, {'patientId' : result['data']['patient_id']});
              }
          }
        }, (err) => {
          if (err.error.data && err.error.data.message) {
            this.utilities.checksessionExpiryError(err.error.data.message);          
          }
        });
      }
     }).catch(err => {
         console.log('Error', err);
         this.utilities.showToast(err, 'top');
     });
  }

}
