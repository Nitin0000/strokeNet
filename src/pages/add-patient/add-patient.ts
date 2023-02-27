import { Component } from '@angular/core';
import { App, NavController, NavParams, ActionSheetController, LoadingController, AlertController, ModalController, ViewController } from 'ionic-angular';

import { WebApiProvider } from '../../providers/web-api/web-api';
import { UtilitiesProvider } from '../../providers/utilities/utilities';
import { PatientDetailPage } from '../patient-detail/patient-detail';

import { Camera, CameraOptions } from '@ionic-native/camera';
import { FileTransfer, FileUploadOptions, FileTransferObject } from '@ionic-native/file-transfer';
import { File } from '@ionic-native/file';
import { Config } from '../../app/app.config';
import { ImagePicker, ImagePickerOptions } from '@ionic-native/image-picker';
import { PhotoViewer } from '@ionic-native/photo-viewer';

import { AddPatientNihssCalculatorPage } from '../add-patient-nihss-calculator/add-patient-nihss-calculator';

import { MediaCapture, MediaFile, CaptureError, CaptureVideoOptions } from '@ionic-native/media-capture';
import { StreamingMedia, StreamingVideoOptions } from '@ionic-native/streaming-media';
import { CovidChecklistPage } from '../covid-checklist/covid-checklist';



@Component({
  selector: 'page-add-patient',
  templateUrl: 'add-patient.html',
})
export class AddPatientPage {
  selectedTab: string = 'normal';
  addPatientData: any = {};

  userData: any = {};
  usertokenData: any = {};

  loading: any;
  isShowingLoading: boolean = false;
  showAlertBox: boolean = true;

  canLeave: boolean = false;

  currentFilesData: any = [];
  filesList: any = [];
  filesListTotal: any = 0;
  currentUploadIndex: any = 1;


  currentDate: any = null;
  currentLocalDate: any = null;


  selectedNIHSSOptions: any;

  constructor(public navCtrl: NavController, public navParams: NavParams, public utilities: UtilitiesProvider, public webApi: WebApiProvider, private actionSheetCtrl: ActionSheetController, private camera: Camera, private file: File, private transfer: FileTransfer, private config: Config, private imagePicker: ImagePicker, private loadingCtrl: LoadingController, public alertCtrl: AlertController, private photoViewer: PhotoViewer, public modalCtrl: ModalController, public viewCtrl: ViewController, public appCtrl: App, private mediaCapture: MediaCapture, private streamingMedia: StreamingMedia) {
    this.userData = this.utilities.getLocalObject("userData");
    this.usertokenData = {
      "userId": this.userData.user_id,
      "userToken": this.userData.token
    };
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

  ionViewWillEnter() {
    if (!this.currentLocalDate) {
      this.currentLocalDate = new Date();
      this.currentLocalDate.setMinutes(new Date().getMinutes() + 330);
      this.currentLocalDate = this.currentLocalDate.toISOString();
    }
    this.addPatientData.covid_score = 0;
    this.addPatientData.covid_values = null;
  }

  getCurrentTime() {
    this.addPatientData.datetime_of_stroke = this.currentLocalDate;
  }

  ionViewCanLeave() {
    if (this.canLeave) {
      //this.viewCtrl.dismiss();
      //this.navCtrl.pop();
    } else {
      this.closeAskQuestionModal();
      return false;
    }
  }

  openCovidCheckListModal() {
    this.canLeave = true;
    let covidCheckListModal = this.modalCtrl.create(CovidChecklistPage, { 'covidData': this.addPatientData.covid_values }, {
      // cssClass: 'add-patient-modal',
      // showBackdrop: true,
      // enableBackdropDismiss:true
    });
    covidCheckListModal.onDidDismiss(data => {
      this.canLeave = false;
      if (data.covidData) {
        this.addPatientData.covid_score = data.covidData.covid_score;
        this.addPatientData.covid_values = data.covidData.covid_values;
      } else {
        this.addPatientData.covid_score = 0;
        this.addPatientData.covid_values = null;
      }

      console.log(JSON.stringify(this.addPatientData, null, "\t"));
    });
    covidCheckListModal.present();
  }

  closeAskQuestionModal() {
    let alert = this.alertCtrl.create({
      title: "Cancel Editing",
      message: "Are you sure you want to exit? The changes you have made will be completed removed once you exit.",
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

  changeTab(tab) {
    this.selectedTab = tab;
  }

  closeModal() {
    this.viewCtrl.dismiss();
  }

  showNIHSSCalculatorModal() {
    let modal = this.modalCtrl.create(AddPatientNihssCalculatorPage, { nihssData: this.selectedNIHSSOptions, fromPage: 'addPatient' });
    modal.onDidDismiss(data => {
      this.addPatientData.nihss_admission = data.points;
      this.selectedNIHSSOptions = data.nihssData;
    });
    modal.present();
  }

  gotoPatientDetailPage(patientDetail) {
    this.navCtrl.push(PatientDetailPage, { "patientDetail": patientDetail });
  }

  deleteFile(image) {
    for (let i = 0; i <= this.currentFilesData.length; i++) {
      if (this.currentFilesData[i] && this.currentFilesData[i]['file'] === image.file) {
        delete this.currentFilesData[i];
      }
    }
  }

  presentImageActionSheet(image) {
    let actionSheet = this.actionSheetCtrl.create({
      title: "Image actions",
      buttons: [
        {
          text: "View full file",
          handler: () => {
            this.photoViewer.show(image.full_image_url);
          }
        },
        {
          text: "Delete file",
          handler: () => {
            this.deleteFile(image);
          }
        },
        {
          text: "Cancel",
          role: 'cancel',
          handler: () => {
          }
        }
      ]
    });
    actionSheet.present();
  }

  addPatient() {

    if (this.addPatientData.covid_values) {
      this.addPatientData.covid_values = JSON.stringify(this.addPatientData.covid_values);
    } else {
      this.addPatientData.covid_score = 0;
      this.addPatientData.covid_values = null;
    }

    this.utilities.showLoading("Please wait...");
    this.webApi.addPatient(this.usertokenData, this.addPatientData).then((result) => {
      this.utilities.hideLoading();
      setTimeout(() => {
        this.canLeave = true;
        if (result['data'] && result['data']['id']) {
          this.addPatientData = {};
          this.utilities.showToast("Patient was successfully added", 'top');
          this.viewCtrl.dismiss({ "patientId": result['data']['id'] });
        }
      }, 200);
    }, (err) => {
      this.utilities.hideLoading();
      if (err.error.data && err.error.data.message) {
        this.utilities.showAlert("error", err.error.data.message);
      }
    });
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad AddPatientPage');
  }

  uploadFiles() {
    if (!this.isShowingLoading) {
      this.loading = this.loadingCtrl.create({
        content: "Uploading files : (" + this.currentUploadIndex + "/" + this.filesListTotal + ")"
      });
      this.loading.present();
      this.isShowingLoading = true;
    }

    const fileTransfer: FileTransferObject = this.transfer.create();
    let options: FileUploadOptions = {
      fileKey: 'file',
      fileName: 'image.jpg',
      headers: {},
      params: { 'module_type': 'patient_file' }
    }
    if (this.filesList.length > 0) {
      fileTransfer.upload(this.filesList[0], this.config.imageUploadUrl, options)
        .then((data) => {
          let imagedata = JSON.parse(data.response);

          let save_path = imagedata.data.save_path;
          let file_type = imagedata.data.file_type;
          let image_url = imagedata.data.image_url;
          let full_image_url = imagedata.data.full_image_url;

          let fileData = {
            'file': save_path,
            'file_url': image_url,
            'file_type': file_type,
            'scan_type': 'ncct',
            'full_image_url': full_image_url
          };
          this.currentFilesData.push(fileData);
          this.filesList.shift();

          setTimeout(() => {
            if (this.currentUploadIndex < this.filesListTotal) {
              this.currentUploadIndex = this.currentUploadIndex + 1;
              this.loading.setContent("Uploading files : (" + this.currentUploadIndex + "/" + this.filesListTotal + ")");
            }
            this.uploadFiles();
          }, 1000);

        }, (err) => {
          this.isShowingLoading = false;
          this.loading.dismiss();
        });
    } else {
      this.isShowingLoading = false;
      this.loading.dismiss();
      this.currentUploadIndex = 1;
      this.filesListTotal = 0;
      this.utilities.showToast("Files uploaded successfully", "top");
    }
  }


  presentActionSheet() {
    let actionSheet = this.actionSheetCtrl.create({
      title: "Upload Images/Video",
      buttons: [
        {
          text: "Capture photo from Camera",
          handler: () => {
            const options: CameraOptions = {
              sourceType: this.camera.PictureSourceType.CAMERA,
              destinationType: this.camera.DestinationType.FILE_URI,
              quality: 100,
              // targetWidth: 500,
              // targetHeight: 500,
              encodingType: this.camera.EncodingType.JPEG,
              correctOrientation: true,
              // allowEdit: true
            }
            this.camera.getPicture(options).then((imageData) => {
              this.filesList.push(imageData);
              this.uploadFiles();
              this.filesListTotal = this.filesList.length;
            }, (err) => {
              // Handle error
            });
          }
        },

        {
          text: "Pick images from Gallery",
          handler: () => {
            console.log("Pick multiple files from Gallery!");
            const options: ImagePickerOptions = {
              maximumImagesCount: 20
            };
            this.imagePicker.getPictures(options).then((results) => {
              for (var i = 0; i < results.length; i++) {
                this.filesList.push(results[i]);
                this.filesListTotal = this.filesList.length;
              }
              this.uploadFiles();
            }, (err) => { });
          }
        },
        {
          text: "Record a Video",
          handler: () => {

            let options: CaptureVideoOptions = { limit: 1, duration: 600 }
            this.mediaCapture.captureVideo(options)
              .then(
                (data: MediaFile[]) => {
                  console.log(JSON.stringify(data, null, "\t"));
                  this.filesList.push(data[0].fullPath);
                  this.filesListTotal = this.filesList.length;
                  setTimeout(() => {
                    this.uploadFiles();
                  }, 500);
                },
                (err: CaptureError) => {
                  console.log(JSON.stringify(err, null, "\t"));
                }
              );

          }
        },
        {
          text: "Video from Gallery",
          handler: () => {
            const options: CameraOptions = {
              sourceType: this.camera.PictureSourceType.PHOTOLIBRARY,
              destinationType: this.camera.DestinationType.FILE_URI,
              mediaType: this.camera.MediaType.VIDEO,
              quality: 70,
              correctOrientation: true,
            }
            this.camera.getPicture(options).then((videoURI) => {
              console.log(JSON.stringify(videoURI, null, "\t"));

              this.filesList.push(videoURI);
              this.filesListTotal = this.filesList.length;
              setTimeout(() => {
                this.uploadFiles();
              }, 500);

            }, (err) => {
              // Handle error
            });
          }
        },
        {
          text: "Cancel",
          role: 'cancel',
          handler: () => {
          }
        }
      ]
    });
    actionSheet.present();
  }



}
