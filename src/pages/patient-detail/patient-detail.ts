import { Component, ViewChild, ElementRef } from '@angular/core';
import { NavController, Content, NavParams, ModalController, AlertController, Platform, ToastController } from 'ionic-angular';
import { PatientNihssPage } from '../patient-nihss/patient-nihss';

import { WebApiProvider } from '../../providers/web-api/web-api';
import { UtilitiesProvider } from '../../providers/utilities/utilities';
import { PatientScanFilesPage } from '../patient-scan-files/patient-scan-files';
import { PatientSummaryPage } from '../patient-summary/patient-summary';
import { PatientBasicDetailsPage } from '../patient-basic-details/patient-basic-details';
import { PatientPresentationPage } from '../patient-presentation/patient-presentation';
import { QrcodePage } from '../qrcode/qrcode';
import { PatientMrsPage } from '../patient-mrs/patient-mrs';
import { PatientAnalysisPage } from '../patient-analysis/patient-analysis';
import { CallNumber } from '@ionic-native/call-number';

import { Observable, Subscription } from 'rxjs/Rx';
import 'rxjs/add/operator/map';
import { ChatPage } from '../chat/chat';
import { PatientComplicationsPage } from '../patient-complications/patient-complications';

import { PhotoViewer } from '@ionic-native/photo-viewer';
import { StreamingMedia, StreamingVideoOptions } from '@ionic-native/streaming-media';
import { ImageSliderPage } from '../image-slider/image-slider';
import { PatientScanTimesModalPage } from '../patient-scan-times-modal/patient-scan-times-modal';
import { PatientIvtMedicationPage } from '../patient-ivt-medication/patient-ivt-medication';
import { PatientContradictionsPage } from '../patient-contradictions/patient-contradictions';

import { CacheSrcService } from 'ionic-cache-src';

// import { VideoPlayer } from '@ionic-native/video-player';
import { CacheItem } from 'ionic-cache-src/dist/interfaces/CacheItem';

import { FileTransfer, FileTransferObject } from '@ionic-native/file-transfer';
import { File } from '@ionic-native/file';
import { NearestSpokesPage } from '../nearest-spokes/nearest-spokes';



@Component({
  selector: 'page-patient-detail',
  templateUrl: 'patient-detail.html',
})
export class PatientDetailPage {

  @ViewChild(Content) content: Content;

  selectedContradictionsData: any = new Array();
  currentContracdictions: any = new Array();
  currentContracdictionsText: string = null;
  contradictions: any = [
    {
      "label_en": "Absolute Contraindications",
      "contraction_type": "absolute_contradictions",
      "selected_points": 0,
      "options": [
        {
          "label": "Did not consent",
          "points": 1,
          "name": 'absolute_contradictions_1',
          "checked": false,
        },
        {
          "label": "Head trauma X 3 months",
          "points": 1,
          "name": 'absolute_contradictions_2',
          "checked": false,
        },
        {
          "label": "Prior stroke X 3 months",
          "points": 1,
          "name": 'absolute_contradictions_3',
          "checked": false,
        },
        {
          "label": "Symptoms suggesting SAH",
          "points": 1,
          "name": 'absolute_contradictions_4',
          "checked": false,
        },
        {
          "label": "Arterial puncture at noncompressible site X 7 days",
          "points": 1,
          "name": 'absolute_contradictions_5',
          "checked": false,
        },
        {
          "label": "Previous ICH",
          "points": 1,
          "name": 'absolute_contradictions_6',
          "checked": false,
        },
        {
          "label": "Intracranial neoplasm, AVM, or aneurysm",
          "points": 1,
          "name": 'absolute_contradictions_7',
          "checked": false,
        },
        {
          "label": "Recent intracranial or intraspinal surgery",
          "points": 1,
          "name": 'absolute_contradictions_8',
          "checked": false,
        },
        {
          "label": "BP >185mmHg(SP)/>110mmHg(DP)",
          "points": 1,
          "name": 'absolute_contradictions_9',
          "checked": false,
        },
        {
          "label": "Active internal bleeding",
          "points": 1,
          "name": 'absolute_contradictions_10',
          "checked": false,
        },
        {
          "label": "Acute bleeding diathesis",
          "points": 1,
          "name": 'absolute_contradictions_11',
          "checked": false,
        },
        {
          "label": "Heparin X48 hours with raised aPTT",
          "points": 1,
          "name": 'absolute_contradictions_12',
          "checked": false,
        },
        {
          "label": "Current use of NOACs (with elevated PT, aPTT, TT, ECT)",
          "points": 1,
          "name": 'absolute_contradictions_13',
          "checked": false,
        },
        {
          "label": "Blood glucose concentration <50mg/dL (2.7 mmol/L)",
          "points": 1,
          "name": 'absolute_contradictions_14',
          "checked": false,
        }
      ],
    },
    {
      "label_en": "Relative Contraindications",
      "contraction_type": "relative_contradictions",
      "selected_points": 0,
      "options": [
        {
          "label": "Minor/rapidly improving symptoms",
          "points": 1,
          "name": 'relative_contradictions_1',
          "checked": false,
        },
        {
          "label": "Pregnancy",
          "points": 1,
          "name": 'relative_contradictions_2',
          "checked": false,
        },
        {
          "label": "Seizure at onset with postictal residual neurological impairments",
          "points": 1,
          "name": 'relative_contradictions_3',
          "checked": false,
        },
        {
          "label": "Major surgery or serious trauma X 14 days",
          "points": 1,
          "name": 'relative_contradictions_4',
          "checked": false,
        },
        {
          "label": "Recent GI or urinary tract hemorrhage X 21 days",
          "points": 1,
          "name": 'relative_contradictions_5',
          "checked": false,
        },
        {
          "label": "Recent acute MI X 3 months",
          "points": 1,
          "name": 'relative_contradictions_6',
          "checked": false,
        }
      ],
    },
  ];

  covid_checklist: any = [
    {
      "label_en": "Are you experiencing any of the following symptoms?",
      "selected_points": 0,
      "options": [
        {
          "label": "Cough",
          "points": 1,
          "name": 'symptoms_1',
          "checked": false,
        },
        {
          "label": "Fever",
          "points": 1,
          "name": 'symptoms_2',
          "checked": false,
        },
        {
          "label": "Difficulty in breathing",
          "points": 1,
          "name": 'symptoms_3',
          "checked": false,
        },
        {
          "label": "Loss of senses of smell and taste",
          "points": 1,
          "name": 'symptoms_4',
          "checked": false,
        },
        {
          "label": "None of the above",
          "points": 0,
          "name": 'symptoms_5',
          "checked": false,
        }
      ],
    },
    {
      "label_en": "Have you ever had any of the following?",
      "selected_points": 0,
      "options": [
        {
          "label": "Diabetes",
          "points": 1,
          "name": 'diseases_1',
          "checked": false,
        },
        {
          "label": "Hypertension",
          "points": 1,
          "name": 'diseases_2',
          "checked": false,
        },
        {
          "label": "Lung disease",
          "points": 1,
          "name": 'diseases_3',
          "checked": false,
        },
        {
          "label": "Heart disease",
          "points": 1,
          "name": 'diseases_4',
          "checked": false,
        },
        {
          "label": "Kidney Disorder",
          "points": 1,
          "name": 'diseases_5',
          "checked": false,
        },
        {
          "label": "None of the above",
          "points": 0,
          "name": 'diseases_6',
          "checked": false,
        }
      ],
    },
    {
      "label_en": "Have you ever travelled anywhere internationally in the last 45 days?",
      "selected_points": 0,
      "options": [
        {
          "label": "Yes",
          "points": 1,
          "name": 'travel_1',
          "checked": false,
        },
        {
          "label": "No",
          "points": 0,
          "name": 'travel_2',
          "checked": false,
        }
      ],
    },
    {
      "label_en": "Are you from containment zone?",
      "selected_points": 0,
      "options": [
        {
          "label": "Yes",
          "points": 1,
          "name": 'containment_1',
          "checked": false,
        },
        {
          "label": "No",
          "points": 0,
          "name": 'containment_2',
          "checked": false,
        }
      ],
    },
    {
      "label_en": "Which of the following apply to you?",
      "selected_points": 0,
      "options": [
        {
          "label": "I have recently interacted or lived with someone who has tested positive for COVID-19",
          "points": 1,
          "name": 'contact_1',
          "checked": false,
        },
        {
          "label": "I am a healthcare worker and examined a COVID-19 confirmed case without protective gear",
          "points": 1,
          "name": 'contact_2',
          "checked": false,
        },
        {
          "label": "None of the above",
          "points": 0,
          "name": 'contact_3',
          "checked": false,
        }
      ],
    }

  ];

  patientDetail: any = {};
  userData: any = {};
  usertokenData: any = {};

  private futureIncrement: Date;
  private futureDecrement: Date;

  private incrementdiff: number;
  private decrementdiff: number;
  private $incrementCounter: Observable<number>;
  private $counter: Observable<number>;
  private IncrementSubscription: Subscription;
  private DecrementSubscription: Subscription;

  incrementTimerMessage: string;
  decrementTimerMessage: string;
  showCOVIDValues: boolean = false;

  selectedFilesTab: string = 'cta_ctp';
  selectedFilesTabText: string = "CT/CTA";
  currentFilesData: any = {};


  finalid: any;

  filePaths: any = [];

  fileData: {
    url: string,
    cacheUrl: CacheItem,
  }

  updateStatusTypes: any = {
    "basic_details": "Basic Details",
    "nihss": "NIHSS UPdate",
    "presentation": "Presentation",
    "complications": "Complications",
    "scan_details": "Scan Timings",
    "medications": "IVT/Medication",
    "ivt_checklist": "IVT Checklist",
    "scans_uploaded": "Scans Uploaded",
    "mrs": "MRS Update",
    "comment": "New Comment",
    "status_update": "Status Update",
  }

  constructor(public navCtrl: NavController, public navParams: NavParams, public utilities: UtilitiesProvider, public webApi: WebApiProvider, public modalCtrl: ModalController, public alertCtrl: AlertController, private callNumber: CallNumber, private photoViewer: PhotoViewer, private streamingMedia: StreamingMedia, private _cacheSrv: CacheSrcService, public platform: Platform, private transfer: FileTransfer, private file: File, private toastCtrl: ToastController) {
    this.userData = this.utilities.getLocalObject("userData");
    this.usertokenData = {
      "userId": this.userData.user_id,
      "userToken": this.userData.token
    };
    console.log(JSON.stringify(this.usertokenData));
  }

  gotoContentSection(section) {
    //basic_details, nihss,presentation,complications,scan_details,medications,contradictions,scans_uploaded,mrs, comment,status_update
    if (section === "comment" || section === "status_update") {
      if (section === "comment") {
        this.goToPatientAnalysisDiscussion(this.patientDetail.id);
      }
      if (section === "status_update") {
        this.goToPatientAnalysis(this.patientDetail.id);
      }
    } else {
      let yOffset = document.getElementById(section).offsetTop;
      this.content.scrollTo(0, yOffset, 1000);
    }
  }

  gotoFilesSection() {
    let yOffset = document.getElementById("scans_uploaded").offsetTop;
    this.content.scrollTo(0, yOffset, 1000);
  }

  //timings

  changeTab(tab, text) {
    this.selectedFilesTab = tab;
    this.selectedFilesTabText = text;
    this.currentFilesData = this.patientDetail.patient_files[this.selectedFilesTab];

    this.currentFilesData.forEach((element, key) => {
      this.currentFilesData[key]['downloading'] = false;
      let videoUrl = element.file;
      let videoUrlArray = videoUrl.split("/");
      let videoFileName = videoUrlArray[videoUrlArray.length - 1];
      this.file.checkFile(this.file.dataDirectory, videoFileName).then(file => {
        this.currentFilesData['key']['downloaded'] = true;
      }).catch(noFile => {
        this.currentFilesData['key']['downloaded'] = false;
      });
    });


  }


  callPhoneNumber(number) {
    let alert = this.alertCtrl.create({
      title: 'Make a Call',
      message: 'The call will made to the person who added this patient from a respective center.',
      cssClass: 'custom-alert',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          cssClass: 'default',
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



  openWhatsapp(number) {
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
          cssClass: 'success',
          handler: () => {
            window.open("whatsapp://send?phone=91" + number, '_system', 'location=no');
          }
        }
      ]
    });
    alert.present();
  }

  incrementDHMS(t) {
    var days, hours, minutes, seconds;
    days = Math.floor(t / 86400);
    t -= days * 86400;
    hours = Math.floor(t / 3600) % 24;
    t -= hours * 3600;
    minutes = Math.floor(t / 60) % 60;
    t -= minutes * 60;
    seconds = t % 60;

    let timeStamp = [];
    if (days) {
      timeStamp.push(days + 'd')
    }
    timeStamp.push(hours + 'h');
    timeStamp.push(minutes + 'm');
    timeStamp.push(seconds + 's');
    return timeStamp.join(' : ');
  }

  incrementTimer(matchDateTime) {
    var t = matchDateTime.split(/[- :]/);
    this.futureIncrement = new Date(t[0], t[1] - 1, t[2], t[3], t[4], t[5]);
    this.$incrementCounter = Observable.interval(1000).map((x) => {
      this.incrementdiff = Math.floor((new Date().getTime() - this.futureIncrement.getTime()) / 1000);
      return x;
    });
    this.IncrementSubscription = this.$incrementCounter.subscribe((x) => {
      if (this.incrementdiff <= 0) {
        this.IncrementSubscription.unsubscribe();
        this.getSinglePatientDetails(this.navParams.get("patientId"));
      } else {
        this.incrementTimerMessage = this.incrementDHMS(this.incrementdiff);
      }
    });
  }

  decrementDHMS(t) {
    var days, hours, minutes, seconds;
    days = Math.floor(t / 86400);
    t -= days * 86400;
    hours = Math.floor(t / 3600) % 24;
    t -= hours * 3600;
    minutes = Math.floor(t / 60) % 60;
    t -= minutes * 60;
    seconds = t % 60;
    return [
      // days + 'd',
      // hours + 'h',
      minutes + 'm',
      seconds + 's'
    ].join(' : ');
  }

  decrementTimer(matchDateTime) {
    var t = matchDateTime.split(/[- :]/);
    this.futureDecrement = new Date(t[0], t[1] - 1, t[2], t[3], t[4], t[5]);

    this.$counter = Observable.interval(1000).map((x) => {
      this.decrementdiff = Math.floor((this.futureDecrement.getTime() - new Date().getTime()) / 1000);
      return x;
    });
    this.DecrementSubscription = this.$counter.subscribe((x) => {
      if (this.decrementdiff <= 0) {
        this.DecrementSubscription.unsubscribe();
        this.getSinglePatientDetails(this.navParams.get("patientId"));
      } else {
        this.decrementTimerMessage = this.decrementDHMS(this.decrementdiff);
      }
    });
  }

  ionViewWillLeave() {
    if (this.IncrementSubscription) {
      this.IncrementSubscription.unsubscribe();
    }
    if (this.DecrementSubscription) {
      this.DecrementSubscription.unsubscribe();
    }
  }

  getSinglePatientDetails(patientId) {
    console.log("Patient: " + patientId);
    this.webApi.getSinglePatient(this.usertokenData, patientId).then((result) => {
      if (result['data'] && result['data']) {
        this.patientDetail = result['data'];

        // Contradictions Process
        this.currentContracdictions = new Array();
        this.currentContracdictionsText = null;

        if (this.patientDetail.patient_contradictions.contradictions_data !== null) {
          this.selectedContradictionsData = this.patientDetail.patient_contradictions.contradictions_data.split(",");
          for (let selection = 0; selection <= this.selectedContradictionsData.length - 1; selection++) {
            for (let ai = 0; ai <= this.contradictions.length - 1; ai++) {
              for (let az = 0; az <= this.contradictions[ai]['options'].length - 1; az++) {
                if (this.selectedContradictionsData[selection] == this.contradictions[ai]['options'][az]['name']) {
                  this.contradictions[ai]['options'][az]['checked'] = true;
                  this.currentContracdictions.push(this.contradictions[ai]['options'][az]['label']);
                }
              }
            }
          }
          this.currentContracdictionsText = this.currentContracdictions.join(", ");
        }
        // Contradictions Process

        // Covid
        if (this.patientDetail.covid_score == null || this.patientDetail.covid_score == 0) {
          for (let i = 0; i <= this.covid_checklist.length - 1; i++) {
            for (let z = 0; z <= this.covid_checklist[i]['options'].length - 1; z++) {
              if (this.covid_checklist[i]['options'][z]['points'] == 0) {
                this.covid_checklist[i]['options'][z]['checked'] = true;
              }
            }
          }
          this.patientDetail.covid_values = this.covid_checklist;
        }

        if (this.patientDetail.show_increment_timer) {
          this.incrementTimer(this.patientDetail.datetime_of_stroke);
        }
        if (this.patientDetail.show_decrement_timer) {
          this.decrementTimer(this.patientDetail.datetime_of_procedure_to_be_done);
        }

        this.currentFilesData = this.patientDetail.patient_files[this.selectedFilesTab];

        this.currentFilesData.forEach((element, key) => {
          this.currentFilesData[key]['downloading'] = false;
          let videoUrl = element.file;
          let videoUrlArray = videoUrl.split("/");
          let videoFileName = videoUrlArray[videoUrlArray.length - 1];
          this.file.checkFile(this.file.dataDirectory, videoFileName).then(file => {
            this.currentFilesData[key]['downloaded'] = true;
          }).catch(noFile => {
            this.currentFilesData[key]['downloaded'] = false;
          });
        });

        // let files = [];
        // this.patientDetail.patient_files['ncct'].forEach(element => {             
        //   if(element.file_type !== "mp4"){
        //     files.push(element.file);
        //     files.push(element.file_thumb);
        //   } 
        // });
        // this.patientDetail.patient_files['cta_ctp'].forEach(element => {          
        //   if(element.file_type !== "mp4"){
        //     files.push(element.file);
        //     files.push(element.file_thumb);
        //   } 
        // });
        // this.patientDetail.patient_files['mri'].forEach(element => {
        //   if(element.file_type !== "mp4"){
        //     files.push(element.file);
        //     files.push(element.file_thumb);
        //   } 
        // });
        // this.patientDetail.patient_files['mra'].forEach(element => {
        //   if(element.file_type !== "mp4"){
        //     files.push(element.file);
        //     files.push(element.file_thumb);
        //   }             
        // });
        // this._cacheSrv.cacheAll(files)
        // .subscribe(cacheItems => {                  
        //     this.filePaths = cacheItems.map(item => item.path);
        // });
      }
    }, (err) => {
      if (err.error.data && err.error.data.message) {
        this.utilities.checksessionExpiryError(err.error.data.message);
      }
    });
  }


  ionViewWillEnter() {
    this.getSinglePatientDetails(this.navParams.get("patientId"));
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad PatientDetailPage');
  }
  gotoPatientBasicDetails(basicDetails, patientId) {
    this.navCtrl.push(PatientBasicDetailsPage, { "basicDetails": basicDetails, "patientId": patientId });
  }

  goToPatientPresentation(presentationData, patientId) {
    this.navCtrl.push(PatientPresentationPage, { "presentationData": presentationData, "patientId": patientId });
  }

  goToNIHSSPage(nihssData, patientId) {
    this.navCtrl.push(PatientNihssPage, { "nihssData": nihssData, "patientId": patientId });
  }

  gotoMRSPage(mrsData, patientId) {
    this.navCtrl.push(PatientMrsPage, { "mrsData": mrsData, "patientId": patientId });
  }

  goToPatientAnalysis(patientId) {
    this.navCtrl.push(PatientAnalysisPage, { "patientId": patientId });
  }
  goToPatientAnalysisDiscussion(patientId) {
    this.navCtrl.push(PatientAnalysisPage, { "patientId": patientId, "gotoTab": "comments" });
  }
  goToPatientAnalysisTeam(patientId) {
    this.navCtrl.push(PatientAnalysisPage, { "patientId": patientId, "gotoTab": "users_online" });
  }



  gotoPatientComplicationsPage() {
    this.navCtrl.push(PatientComplicationsPage, { "complicationsData": this.patientDetail['patient_complications'], "patientId": this.patientDetail.id });
  }

  viewQRCode(code) {


    let openQRModal = this.modalCtrl.create(QrcodePage, null, {
      cssClass: 'add-patient-modal',
      showBackdrop: true,
      enableBackdropDismiss: true
    });
    openQRModal.present();

  }

  gotoPatientSummaryPage(patientId) {
    this.navCtrl.push(PatientSummaryPage, { "patientId": patientId });
  }

  goToPatientScanFilesPage(patientId) {
    this.navCtrl.push(PatientScanFilesPage, { "patientId": patientId, "scanType": this.selectedFilesTab, "pageTitle": this.selectedFilesTabText, "aspectsNumber": this.patientDetail.patient_basic_details.aspects });
  }

  scrolltoCovidStatus() {
    let yOffset = document.getElementById("covidStatus").offsetTop;
    this.content.scrollTo(0, yOffset, 1000)
  }

  showHideCovidStatus() {
    if (this.showCOVIDValues) {
      this.showCOVIDValues = false;
    } else {
      this.showCOVIDValues = true;
    }
  }


  alertHubAndStartTransition() {
    let alert = this.alertCtrl.create({
      title: "Alert Hub?",
      message: 'Are you sure you want to transit patient to the nearest hub? This will start the transition procedure.',
      cssClass: 'custom-alert',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          cssClass: 'default',
          handler: () => {

          }
        },
        {
          text: 'Start',
          cssClass: 'success',
          handler: () => {
            this.utilities.showLoading("Please wait...");
            let patientData = {
              "patient_id": this.navParams.get("patientId")
            };
            this.webApi.alertHubAndStartTransition(this.usertokenData, patientData).then((result) => {
              if (result['data'] && result['data']) {

                // this.getSinglePatientDetails(this.navParams.get("patientId"));

                setTimeout(() => {
                  this.utilities.hideLoading();
                  this.utilities.showAlert('success', result['data']['message']);

                  this.navCtrl.pop();

                }, 500);

              }
            }, (err) => {
              console.log(JSON.stringify(err, null, "\t"));
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


  showListofNearestSpokeCenters() {
    this.utilities.showLoading("Please wait...");
    this.webApi.getNearestHubSpokeCenters(this.usertokenData, this.navParams.get("patientId")).then((result) => {
      if (result['data'] && result['data']) {
        this.utilities.hideLoading();

        let chooseSpokeCenterModal = this.modalCtrl.create(NearestSpokesPage, {
          'centers': result['data']
        }, {
          cssClass: 'add-patient-modal',
          showBackdrop: true,
          enableBackdropDismiss: true
        });
        chooseSpokeCenterModal.onDidDismiss(data => {
          if (data && data.spokeId) {
            this.alertSpokeAndStartTransition(data.spokeId);
          }
        });
        chooseSpokeCenterModal.present();
      }
    }, (err) => {
      console.log(JSON.stringify(err, null, "\t"));
      if (err.error.data && err.error.data.message) {
        this.utilities.checksessionExpiryError(err.error.data.message);
      }
    });
  }

  alertSpokeAndStartTransition(spokeId) {
    let alert = this.alertCtrl.create({
      title: "Alert Spoke/Hub?",
      message: 'Are you sure you want to transit patient to the selected hospital? This will start the transition procedure.',
      cssClass: 'custom-alert',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          cssClass: 'default',
          handler: () => {
          }
        },
        {
          text: 'Start',
          cssClass: 'success',
          handler: () => {
            this.utilities.showLoading("Please wait...");
            let patientData = {
              "patient_id": this.navParams.get("patientId"),
              "spokeId": spokeId,
            };
            this.webApi.alertSpokeAndStartTransition(this.usertokenData, patientData).then((result) => {
              if (result['data'] && result['data']) {

                // this.getSinglePatientDetails(this.navParams.get("patientId"));

                setTimeout(() => {
                  this.utilities.hideLoading();
                  this.utilities.showAlert('success', result['data']['message']);

                  this.navCtrl.pop();

                }, 500);

              }
            }, (err) => {
              console.log(JSON.stringify(err, null, "\t"));
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

  gotoChatPage(chatId) {
    this.navCtrl.push(ChatPage, { chatId: chatId });
  }

  stopClocksManually() {
    let alert = this.alertCtrl.create({
      title: "Stop Clock?",
      message: 'Are you sure you want to stop the clock manually?',
      cssClass: 'custom-alert',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          cssClass: 'default',
          handler: () => {

          }
        },
        {
          text: 'Yes! Stop',
          cssClass: 'success',
          handler: () => {
            let apiData = {
              "patient_id": this.navParams.get("patientId")
            };
            this.utilities.showLoading("Please wait...");
            let usertokenData = { "userId": this.userData.user_id, "userToken": this.userData.token };
            this.webApi.stopClockManually(usertokenData, apiData).then((result) => {
              this.utilities.hideLoading();
              this.getSinglePatientDetails(this.navParams.get("patientId"));
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

  array_chunk(chunkSize, array) {
    return array.reduce(function (previous, current) {
      var chunk;
      if (previous.length === 0 ||
        previous[previous.length - 1].length === chunkSize) {
        chunk = [];   // 1
        previous.push(chunk);   // 2
      }
      else {
        chunk = previous[previous.length - 1];   // 3
      }
      chunk.push(current);   // 4
      return previous;   // 5
    }, []);   // 6
  }

  showThromobolysisAlert() {
    let alert = this.alertCtrl.create({
      title: "Caution: Patient may not be eligible for thorombolysis.",
      message: 'Are you sure want to thrombolis the patient?',
      cssClass: 'custom-alert',
      buttons: [
        {
          text: 'No',
          role: 'cancel',
          cssClass: 'default',
          handler: () => {

          }
        },
        {
          text: 'Yes',
          cssClass: 'success',
          handler: () => {
            this.openPatientMedicationsModal();
          }
        }
      ]
    });
    alert.present();
  }

  openPatientContradictionsModal() {
    let contradictionsModal = this.modalCtrl.create(PatientContradictionsPage, { "patientId": this.patientDetail.id, "patientContradictionsData": this.patientDetail.patient_contradictions });
    contradictionsModal.onDidDismiss((data) => {

      if (data && data.contradictionsData) {
        if (data.contradictionsData.relative_score > 0 && !this.patientDetail.patient_ivt_medications.medicine) {
          this.showThromobolysisAlert();
        }
      }

      if (data && data.contradictionsData) {
        if (data.contradictionsData.absolute_ > 0 && !this.patientDetail.patient_ivt_medications.medicine) {
          this.showThromobolysisAlert();
        }
      }

      this.getSinglePatientDetails(this.patientDetail.id);
    });
    contradictionsModal.present();
  }

  openPatientMedicationsModal() {
    console.log(JSON.stringify(this.patientDetail.patient_basic_details, null, "\t"));
    let medicationsModal = this.modalCtrl.create(PatientIvtMedicationPage, { "patientId": this.patientDetail.id, "patientMedicationData": this.patientDetail.patient_ivt_medications, "patientWeight": this.patientDetail.patient_basic_details.body_weight }, {
      cssClass: 'add-patient-medications-modal',
      showBackdrop: true,
      enableBackdropDismiss: true
    });
    medicationsModal.onDidDismiss(() => {
      this.getSinglePatientDetails(this.patientDetail.id);
    });
    medicationsModal.present();
  }


  openpatientScansModal() {
    let scanTimesModal = this.modalCtrl.create(PatientScanTimesModalPage, { "patientId": this.patientDetail.id, "patientScanTimesData": this.patientDetail.patient_scan_times }, {
      cssClass: 'add-patient-timings-modal',
      showBackdrop: true,
      enableBackdropDismiss: true
    });
    scanTimesModal.onDidDismiss(() => {
      this.getSinglePatientDetails(this.patientDetail.id);
    });
    scanTimesModal.present();
  }

  scrolltoBottom() {
    this.content.scrollToBottom(500);
  }
  scrolltoTop() {
    this.content.scrollToTop(500);
  }

  checkIfScansUploaded() {
    let alert = this.alertCtrl.create({
      title: "Scans Uploaded?",
      message: 'Are you sure want to alert the team regarding uploaded scans?',
      cssClass: 'custom-alert',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          cssClass: 'default',
          handler: () => {

          }
        },
        {
          text: 'Yes! Update',
          cssClass: 'success',
          handler: () => {
            this.utilities.showLoading("Please wait...");
            this.webApi.scansUploadedAlertToTeam(this.usertokenData, { "patient_id": this.patientDetail.id }).then((result) => {
              this.utilities.hideLoading();
              if (result['data'] && result['data']['message']) {
                this.utilities.showAlert("success", result['data']['message']);
                this.getSinglePatientDetails(this.patientDetail.id);
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

  scansCompleted() {
    let alert = this.alertCtrl.create({
      title: "Scans Completed?",
      message: 'Are you sure scans are completed? You wont be able to undo this action later.',
      cssClass: 'custom-alert',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          cssClass: 'default',
          handler: () => {

          }
        },
        {
          text: 'Yes! Completed',
          cssClass: 'success',
          handler: () => {
            this.openpatientScansModal();
          }
        }
      ]
    });
    alert.present();
  }


  // cacheImage(url){    
  //   console.log(url);
  //   this._cacheSrv.find(url).subscribe(cachedUrl => {   
  //     if(cachedUrl !== null && cachedUrl.key){
  //       return cachedUrl.path;
  //     }else{
  //       this._cacheSrv.cache(url)
  //       .subscribe(cachedUrl => {    
  //         return cachedUrl.path;
  //       });
  //     }
  //   }); 
  // }


  // checkIfVideoExistImage(fileData){
  //   let videoUrl = fileData.file;  
  //   let videoUrlArray = videoUrl.split("/");
  //   let videoFileName = videoUrlArray[videoUrlArray.length - 1];
  //   this.file.checkFile(this.file.dataDirectory,  videoFileName).then(file => {      
  //     return "assets/imgs/video.png";
  //   }).catch(noFile => {   
  //     return "assets/imgs/download.png";
  //   });
  // }

  downloadVideo(fileData, main, secondary) {
    let arrayrecordId = 0;

    this.currentFilesData.forEach((element, key) => {
      if (element.id == fileData.id) {
        arrayrecordId = key;
      }
    });

    let videoUrl = fileData.file;
    let videoUrlArray = videoUrl.split("/");
    let videoFileName = videoUrlArray[videoUrlArray.length - 1];

    this.file.checkFile(this.file.dataDirectory, videoFileName).then(file => {
      this.playVideo(this.file.dataDirectory + videoFileName);
    }).catch(noFile => {

      this.currentFilesData[arrayrecordId]['downloading'] = true;

      const fileTransfer: FileTransferObject = this.transfer.create();
      fileTransfer.download(fileData.file, this.file.dataDirectory + videoFileName).then((entry) => {
        // console.log('download complete: ' + entry.toURL());
        // this.playVideo(this.file.dataDirectory + videoFileName);
        this.currentFilesData[arrayrecordId]['downloading'] = false;
        this.currentFilesData[arrayrecordId]['downloaded'] = true;

        this.utilities.showToast("Video downloaded", "top");

      });
      fileTransfer.onProgress(progress => {
        console.log((progress.loaded / progress.total) * 100);
        if (progress.loaded === progress.total) {
          console.log('Finished');
          this.currentFilesData[arrayrecordId]['downloaded'] = true;
        }
      });
    });
  }

  playVideo(videoPath) {
    console.log(videoPath);

    let options: StreamingVideoOptions = {
      successCallback: () => { console.log('Video played') },
      errorCallback: (e) => { console.log('Error streaming') },
      shouldAutoClose: true,
      controls: false
    };
    this.streamingMedia.playVideo(videoPath, options);
  }


  openImageinModal(main, secondary) {
    this.finalid = parseInt((main + main) + secondary);
    let photoModal = this.modalCtrl.create(ImageSliderPage, { currentslide: this.finalid, images: this.currentFilesData });
    photoModal.present();
  }
}
