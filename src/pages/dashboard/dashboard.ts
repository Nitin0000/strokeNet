import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ModalController, Events, AlertController, Platform } from 'ionic-angular';
import { ContentPage } from '../content/content';
import { UtilitiesProvider } from '../../providers/utilities/utilities';
import { AddPatientPage } from '../add-patient/add-patient';
import { AddPatientNihssCalculatorPage } from '../add-patient-nihss-calculator/add-patient-nihss-calculator';
import { PatientsListPage } from '../patients-list/patients-list';
import { BarcodeScanner } from '@ionic-native/barcode-scanner';

import { WebApiProvider } from '../../providers/web-api/web-api';
import { PatientDetailPage } from '../patient-detail/patient-detail';
import { PatientSummaryPage } from '../patient-summary/patient-summary';
import { ConversationsPage } from '../conversations/conversations';
import { OnlineTeamPage } from '../online-team/online-team';
import { CovidChecklistPage } from '../covid-checklist/covid-checklist';
import { QualityMatrixPage } from '../quality-matrix/quality-matrix';
// import { Zoom } from '@ionic-native/zoom/ngx';
// private zoomService: Zoom,

@Component({
  selector: 'page-dashboard',
  templateUrl: 'dashboard.html',
})

export class DashboardPage {
  dashboardPages: Page[] = [];
  userData: any = {};
  usertokenData: any = {};

  currentOnlineStatus: any = "Offline";

  constructor(public navCtrl: NavController, public navParams: NavParams, public utilities: UtilitiesProvider, public modalCtrl: ModalController, private barcodeScanner: BarcodeScanner, public webApi: WebApiProvider, public events: Events, public alertCtrl: AlertController, private platform: Platform) {

    this.platform.ready().then(() => {
      // this.zoomService.initialize("ROcKxMhuICZoxwOBavSxIWpWbaNaSoE91cb1", "iPamSyeV2N8KSdUEs884zQ5DIDlJusHRAggT")
      // .then((success: any) => console.log(success))
      // .catch((error: any) => console.log(error));
    });

    this.userData = this.utilities.getLocalObject("userData");

    this.currentOnlineStatus = this.userData.online_status;

    this.usertokenData = {
      "userId": this.userData.user_id,
      "userToken": this.userData.token
    };

    this.dashboardPages = [
      {
        title: 'About Stroke Net Chandigarh',
        icon: 'add',
        showDetails: false,
        subPages: [
          {
            title: 'Introduction To Stroke Net Chandigarh',
            pageId: 5
          },
          {
            title: 'Aim & Objective',
            pageId: 6
          },
          {
            title: 'Algorithm',
            pageId: 7
          },
        ]
      },
      {
        title: 'Stroke Net Protocols',
        icon: 'add',
        showDetails: false,
        subPages: [
          {
            title: 'Inclusion and exclusion criteria',
            pageId: 8
          },
          {
            title: 'Drip & Ship protocol',
            pageId: 9
          },
          {
            title: 'Transfer protocol',
            pageId: 10
          },
          {
            title: 'Hub protocol',
            pageId: 11
          },
        ]
      }
    ];

  }


  // startZoomMeeting(){
  //   // Start an instant meeting for logged in user.
  //   this.zoomService.startInstantMeeting({})
  //   .then((success: any) => console.log(success))
  //   .catch((error: any) => console.log(error));
  // }

  // showNIHSSCalculatorModal() {
  //     let modal = this.modalCtrl.create(AddPatientNihssCalculatorPage, {fromPage: 'dashBoard'});
  //     modal.onDidDismiss(data => {
  //       if(data && data.patientId){}
  //     });
  //     modal.present();
  // }

  gotoConversations() {
    this.navCtrl.push(ConversationsPage);
  }

  scanQRCode() {
    console.log("Scan Qr Code");
    this.barcodeScanner.scan().then(barcodeData => {
      console.log('Barcode data', barcodeData);
      if (barcodeData.text && barcodeData.text !== "") {
        let patientCode = barcodeData.text;
        this.utilities.showLoading("Please wait");
        this.webApi.getSinglePatient(this.usertokenData, patientCode).then((result) => {
          if (result['data'] && result['data']) {
            this.utilities.hideLoading();
            if (result['data'] && result['data']['can_edit_details']) {
              this.navCtrl.push(PatientDetailPage, { 'patientId': result['data']['patient_id'] });
            } else {
              this.navCtrl.push(PatientSummaryPage, { 'patientId': result['data']['patient_id'] });
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

  openAddPatientModal() {
    let addPatientModal = this.modalCtrl.create(AddPatientPage, null, {
      cssClass: 'add-patient-modal',
      showBackdrop: true,
      enableBackdropDismiss: true
    });
    addPatientModal.onDidDismiss(data => {
      if (data && data.patientId) {
        this.sendCodeStrokeAlertConfirm(data.patientId);
      }
    });
    addPatientModal.present();

  }

  gotoPatientsList() {
    this.navCtrl.push(PatientsListPage);
  }

  gotoContentPage(pageId) {
    this.navCtrl.push(ContentPage, { 'pageId': pageId });
  }
  viewOnlineTeam() {
    this.navCtrl.push(OnlineTeamPage);
  }
  gotoQualityMatrixPage() {
    this.navCtrl.push(QualityMatrixPage);
  }

  updateOnlineStatus() {
    this.webApi.updateOnlineStatus(this.usertokenData).then((result) => {
      if (result['data'] && result['data']) {
        this.currentOnlineStatus = result['data']['status'];
        this.utilities.showToast("You are now " + this.currentOnlineStatus, "bottom");
        this.utilities.setLocalObject("userData", result['data']['user_data']);
        this.userData = result['data']['user_data'];
      }
    }, (err) => {
      if (err.error.data && err.error.data.message) {
        this.utilities.checksessionExpiryError(err.error.data.message);
      }
    });
  }

  shiftPatientToCTandUpdateStatus(patientId, message) {
    let alert = this.alertCtrl.create({
      title: message,
      message: 'Do you want to shift the Patient to CT?',
      cssClass: 'custom-alert',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          cssClass: 'default',
          handler: () => {
            console.log("Code Stroke not sent");
          }
        },
        {

          text: 'Yes! Confirm',
          cssClass: 'success',
          handler: () => {
            let transitionStatusData = {
              patient_id: patientId,
              status_id: null
            };

            if (this.userData.is_hub_user) {
              transitionStatusData.status_id = 5;
            }
            else if (this.userData.is_center_user) {
              transitionStatusData.status_id = 20;
            }
            else {
              transitionStatusData.status_id = 3;
            }

            this.utilities.showLoading("Please wait...");
            this.webApi.postTransitionStatus(this.usertokenData, transitionStatusData).then((result) => {
              if (result['data'] && result['data']) {
                // this.utilities.showToast(, "top");
                this.utilities.showAlert('success', result['data']['message']);
                this.utilities.hideLoading();
              }
            }, (err) => {
              if (err.error.data && err.error.data.message) {
                this.utilities.checksessionExpiryError(err.error.data.message);
              }
            });
          }
        }
      ]
    });
    alert.present();
  }

  sendCodeStrokeAlertConfirm(patientId) {
    let alert = this.alertCtrl.create({
      title: "Patient Added!",
      message: 'Would you like to alert the stroke team?',
      cssClass: 'custom-alert',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          cssClass: 'default',
          handler: () => {
            console.log("Code Stroke not sent");

            // Send the user Patient Details
            setTimeout(() => {
              this.navCtrl.push(PatientDetailPage, { "patientId": patientId });
            }, 200);


          }
        },
        {
          text: 'Yes! Alert them!',
          cssClass: 'success',
          handler: () => {
            this.utilities.showLoading("Please wait...");
            let usertokenData = { "userId": this.userData.user_id, "userToken": this.userData.token };

            // Issue with multiple code stroke alerts

            this.webApi.codeStrokeAlert(usertokenData, patientId).then((result) => {
              this.utilities.hideLoading();
              // this.utilities.showAlert("success",result['data']['message']);

              // Show Shift to CT Confirm Dialog
              this.shiftPatientToCTandUpdateStatus(patientId, result['data']['message']);


              // Send the user Patient Details
              setTimeout(() => {
                this.navCtrl.push(PatientDetailPage, { "patientId": patientId });
              }, 200);

            }, (err) => {
              if (err.error.data && err.error.data.message) {
                this.utilities.checksessionExpiryError(err.error.data.message);
              }
            });
          }
        }
      ]
    });
    alert.present();
  }

  createCodeStrokeAlert() {
    let alert = this.alertCtrl.create({
      title: "Code Stroke Alert",
      message: 'Are you sure you want to alert the team for a new patient?',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          handler: () => {

          }
        },
        {
          text: 'Yes!',
          handler: () => {
            let addPatientModal = this.modalCtrl.create(AddPatientPage, null, {
              cssClass: 'add-patient-modal',
              showBackdrop: true,
              enableBackdropDismiss: true
            });
            addPatientModal.onDidDismiss(data => {
              // Patient added
              if (data && data.patientId) {
                console.log("Patient added successfully. PatientId: " + data.patientId);
                // Also show Code Stroke Alert
                this.sendCodeStrokeAlertConfirm(data.patientId);
              }
            });
            addPatientModal.present();
          }
        }
      ]
    });
    alert.present();
  }


  ionViewDidLoad() {
    console.log('ionViewDidLoad DashboardPage');
    // setTimeout(() => {
    //       this.navCtrl.push(PatientDetailPage, {'patientId' : 244});
    // }, 200);
  }


  toggleDetails(data) {
    if (data.showDetails) {
      data.showDetails = false;
      data.icon = 'add';
    } else {
      data.showDetails = true;
      data.icon = 'remove';
    }
  }



}

export class Page {
  title: string;
  icon: string;
  showDetails: boolean
  subPages: SubPage[];
}

export class SubPage {
  title: string;
  pageId: number;
}


