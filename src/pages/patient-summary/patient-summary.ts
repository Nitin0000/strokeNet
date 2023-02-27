import { Component } from '@angular/core';
import { NavController, NavParams, AlertController } from 'ionic-angular';
import { UtilitiesProvider } from '../../providers/utilities/utilities';
import { WebApiProvider } from '../../providers/web-api/web-api';

import { PhotoViewer } from '@ionic-native/photo-viewer';
import { StreamingMedia, StreamingVideoOptions } from '@ionic-native/streaming-media';
import { PatientAnalysisPage } from '../patient-analysis/patient-analysis';
import { CallNumber } from '@ionic-native/call-number';
import { ChatPage } from '../chat/chat';


@Component({
  selector: 'page-patient-summary',
  templateUrl: 'patient-summary.html'
})
export class PatientSummaryPage {
  userData: any = {};
  usertokenData: any = {};

  patient: any = {};

  selectedFilesTab: string = 'ncct';
  currentFilesData : any = {};
  leaveAdviseData : any = {
    'patient_id' : null,
    'consultant_id' : null,
    'message' : null,
  };

  constructor(public navCtrl: NavController, public navParams: NavParams, public utilities: UtilitiesProvider, public webApi: WebApiProvider, private photoViewer: PhotoViewer, private streamingMedia: StreamingMedia, private callNumber: CallNumber, public alertCtrl: AlertController) {
    this.selectedFilesTab = 'ncct';
    this.userData = this.utilities.getLocalObject("userData");

    this.usertokenData = {
      "userId": this.userData.user_id,
      "userToken": this.userData.token
    };
  }

  callPhoneNumber(number){
    let alert = this.alertCtrl.create({
      title: 'Make a Call',
      message: 'The call will made to the person who added this patient from a respective center.',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          handler: () => {
            // this.selectedTransitionStatus = null;
          }
        },
        {
          text: 'Call',
          handler: () => {
              this.callNumber.callNumber(number, true)
              .then(res => console.log('Launched dialer!', res))
              .catch(err => console.log('Error launching dialer', err));
          }
        }
      ]
    });
    alert.present();
  }

  openWhatsapp(number){
    let alert = this.alertCtrl.create({
      title: 'Make a video call',
      message: 'Use whatsapp video calling feature to call the person who added this patient from a respective center.',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          handler: () => {
            // this.selectedTransitionStatus = null;
          }
        },
        {
          text: 'Call',
          handler: () => {
            window.open("whatsapp://send?phone=91"+number,'_system','location=no');  
          }
        }
      ]
    });
    alert.present();
  }

  array_chunk(chunkSize, array) {
      return array.reduce(function(previous, current) {
          var chunk;
          if (previous.length === 0 || 
                  previous[previous.length -1].length === chunkSize) {
              chunk = [];   // 1
              previous.push(chunk);   // 2
          }
          else {
              chunk = previous[previous.length -1];   // 3
          }
          chunk.push(current);   // 4
          return previous;   // 5
      }, []);   // 6
  }


  changeTab(tab){
      this.selectedFilesTab = tab;
      this.currentFilesData = this.patient.patient_files[this.selectedFilesTab];
    }

  ionViewWillEnter(){
      this.getSinglePatientDetails(this.navParams.get("patientId"));
  }

  getSinglePatientDetails(patientId){    
    this.utilities.showLoading("Please wait...")
    this.webApi.getSinglePatient(this.usertokenData, patientId).then((result) => {
      if (result['data'] && result['data']) {    
        this.utilities.hideLoading();        
        this.patient = result['data'];
        this.currentFilesData = this.patient.patient_files[this.selectedFilesTab];
      }
    }, (err) => {
      if (err.error.data && err.error.data.message) {
        this.utilities.checksessionExpiryError(err.error.data.message);
      }
    });
  }
  
  leaveAdvise(){
    // this.leaveAdviseData.patient_id = this.patient.id;
    // this.leaveAdviseData.consultant_id = this.userData.user_id;
    // this.utilities.showLoading("Please wait...");
    // this.webApi.leaveAdvise(this.usertokenData, this.leaveAdviseData).then((result) => {
    //   if (result['data'] && result['data'] === "advise_sent") {
    //     this.utilities.showToast("Your advise was successfully sent!", 'top');
    //     this.utilities.hideLoading();   
    //     this.getSinglePatientDetails(this.patient.id);       
    //   }
    // }, (err) => {
    //   this.utilities.hideLoading();
    //   if (err.error.data && err.error.data.message) {
    //     this.utilities.showAlert("error", err.error.data.message);
    //   }
    // });
  }
  
  viewFile(image){
    if(image.file_type === 'jpg'){
      this.photoViewer.show(image.file);
    }else{
      let options: StreamingVideoOptions = {
        successCallback: () => { console.log('Video played') },
        errorCallback: (e) => { console.log('Error streaming') },                
        shouldAutoClose: true,
        controls: true
      };
      this.streamingMedia.playVideo(image.file, options);
    } 
  }

  goToPatientAnalysis(patientId){
    this.navCtrl.push(PatientAnalysisPage, { "patientId": patientId });
  }

  goToPatientAnalysisDiscussion(patientId){
    this.navCtrl.push(PatientAnalysisPage, { "patientId": patientId, "gotoTab" : "comments" });
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad PatientSummaryPage');
  }

  startChat(userId){
    this.utilities.showLoading("Please wait...");
    let usertokenData = {"userId" : this.userData.user_id, "userToken" : this.userData.token};
    this.webApi.createConversation(usertokenData, userId, this.navParams.get("patientId")).then((result) => {
      this.utilities.hideLoading();
      setTimeout(() => {
        this.navCtrl.push(ChatPage,{chatId: result['data']['firebase_id'], conversationData: result['data']});
      },100);
    }, (err) => {
        console.log(JSON.stringify(err, null, "\t"));
        if(err.error.data && err.error.data.message){ 
          this.utilities.checksessionExpiryError(err.error.data.message);
        }
    });
  }

  goToPatientAnalysisTeam(patientId){
    this.navCtrl.push(PatientAnalysisPage, { "patientId": patientId, "gotoTab" : "users_online" });
  }

}
