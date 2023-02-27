import { Component } from '@angular/core';
import { NavController, NavParams, AlertController } from 'ionic-angular';
import { UtilitiesProvider } from '../../providers/utilities/utilities';
import { WebApiProvider } from '../../providers/web-api/web-api';

@Component({
  selector: 'page-quality-matrix',
  templateUrl: 'quality-matrix.html',
})
export class QualityMatrixPage {
  userData: any = {};
  usertokenData: any = {};
  patientType: string = "all";
  patientTypeText: string = "All Patients";

  timePeriod: string = "past_one_week";
  timePeriodText: string = "Past One Week";

  qualityMatrix: any = {};


  constructor(public navCtrl: NavController, public navParams: NavParams, public utilities: UtilitiesProvider, public webApi: WebApiProvider) {
    this.userData = this.utilities.getLocalObject("userData");

    this.usertokenData = {
      "userId": this.userData.user_id,
      "userToken": this.userData.token
    };
  }

  
  onPatientTypeChanged(event){
    console.log(event);
    this.patientType = event;
    this.getQualityMatrix();
  }

  onTimePeriodChanged(event){
    console.log(event);
    this.timePeriod = event;
    this.getQualityMatrix();
  }

  ionViewWillEnter(){
    this.getQualityMatrix();
  }

  getQualityMatrix(){
    this.utilities.showLoading("Please wait...");
    console.log(this.patientType);
    console.log(this.timePeriod);
    
    this.webApi.getQualityMatrix(this.usertokenData, this.patientType, this.timePeriod).then((result) => {
      if (result['data'] && result['data']) {    
        this.utilities.hideLoading();        
        this.qualityMatrix = result['data'];
      }
    }, (err) => {
      this.utilities.hideLoading();
      console.log(JSON.stringify(err));
      if (err.error.data && err.error.data.message) {
        this.utilities.checksessionExpiryError(err.error.data.message);
      }
    });
  }


  ionViewDidLoad() {
    console.log('ionViewDidLoad QualityMatrixPage');
  }

}
