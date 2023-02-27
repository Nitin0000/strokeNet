import { Component } from '@angular/core';
import { NavController, NavParams, ActionSheetController, AlertController, LoadingController} from 'ionic-angular';

import { WebApiProvider } from '../../providers/web-api/web-api';
import { UtilitiesProvider } from '../../providers/utilities/utilities';

import { Camera, CameraOptions } from '@ionic-native/camera';
import { FileTransfer, FileUploadOptions, FileTransferObject } from '@ionic-native/file-transfer';
import { File } from '@ionic-native/file';
import { Config } from '../../app/app.config';
import { ImagePicker, ImagePickerOptions} from '@ionic-native/image-picker';



@Component({
  selector: 'page-patient-complications',
  templateUrl: 'patient-complications.html',
})
export class PatientComplicationsPage {
  userData: any = {};
  usertokenData: any = {};

  complicationsData: any;
  patientId: any;

  loading: any;
  isShowingLoading: boolean = false;

  currentFilesData : any = {};
  filesList : any = [];
  filesListTotal : any = 0;
  currentUploadIndex: any = 1;
  imagesFolder: any = null;
  newUploadedImage: any = null;

  constructor(public navCtrl: NavController, public navParams: NavParams, public utilities: UtilitiesProvider, public webApi: WebApiProvider, private actionSheetCtrl: ActionSheetController,  private camera: Camera,private file: File, private transfer: FileTransfer, private config: Config, private imagePicker: ImagePicker, private loadingCtrl: LoadingController, public alertCtrl: AlertController) {
    this.userData = this.utilities.getLocalObject("userData");
    this.usertokenData = {
      "userId": this.userData.user_id,
      "userToken": this.userData.token
    };
  }

  ionViewWillEnter(){
    this.complicationsData = this.navParams.get("complicationsData");
    this.patientId = this.navParams.get("patientId");
  }

  doUpdatePatientComplicationsData() {
    this.complicationsData.patient_id = this.patientId;

    this.utilities.showLoading("Please wait...");
    this.webApi.updatePatientComplications(this.usertokenData, this.complicationsData).then((result) => {
      this.utilities.hideLoading();
      if (result['data'] && result['data']) {
        this.utilities.showToast(result['data'], 'top');
      }
    }, (err) => {
      this.utilities.hideLoading();
      if (err.error.data && err.error.data.message) {
        this.utilities.showAlert("error", err.error.data.message);
      }
    });
  }

  uploadFiles(){    
    if(!this.isShowingLoading){
        this.loading = this.loadingCtrl.create({
            content: "Uploading files : ("+this.currentUploadIndex+"/"+this.filesListTotal+")"
        });
        this.loading.present();
        this.isShowingLoading = true;
      }
     
      if(this.filesList.length > 0){

        const fileTransfer: FileTransferObject = this.transfer.create();
        let options: FileUploadOptions = {
          fileKey: 'file',
          fileName: this.filesList[0].substr(this.filesList[0].lastIndexOf('/') + 1),
          headers: {},
          params: {'module_type' : 'complication_file'}
        }
        
        fileTransfer.upload(this.filesList[0], this.config.imageUploadUrl, options)
        .then((data) => {
            let imagedata = JSON.parse(data.response);

            let thumbimg_url = imagedata.data.image_url;
            this.newUploadedImage = imagedata.data.full_image_url;
            let save_path = imagedata.data.save_path;
            let file_type = imagedata.data.file_type;
            this.complicationsData.bed_sore_photo = save_path;     
            
            this.isShowingLoading = false;
            this.loading.dismiss();

        }, (err) => {
           this.isShowingLoading = false;
           this.loading.dismiss();
        });
      }else{
        this.isShowingLoading = false;
        this.loading.dismiss();
        this.currentUploadIndex = 1;
        this.filesListTotal = 0;
        // Update the Patient files when all files are uploaded
        console.log("Refresh Patient Files");
        this.utilities.showToast("Files uploaded successfully", "bottom");
      }
}

  presentImagesActionSheet() {        
    let actionSheet = this.actionSheetCtrl.create({
      title: "Upload",
      buttons: [
        {
          text: "Capture from Camera",
          handler: () => {
                const options: CameraOptions = {
                  sourceType: this.camera.PictureSourceType.CAMERA,
                  destinationType: this.camera.DestinationType.FILE_URI,      
                  quality: 100,
                  encodingType: this.camera.EncodingType.JPEG,      
                  correctOrientation: true,
                }
                this.camera.getPicture(options).then((imageData) => {
                  this.filesList.push(imageData);      
                  this.filesListTotal =  this.filesList.length;
                  setTimeout(() => {
                    this.uploadFiles();
                  },500);
                              
                }, (err) => {
                 // Handle error
                });
          }
        },
        {
          text: "Pick from Gallery",
          handler: () => {   
              const options: CameraOptions = {
                quality: 50,
                destinationType: this.camera.DestinationType.FILE_URI,
                encodingType: this.camera.EncodingType.JPEG,
                mediaType: this.camera.MediaType.PICTURE,
                correctOrientation: true,
                sourceType: this.camera.PictureSourceType.PHOTOLIBRARY,
              }             
                this.camera.getPicture(options).then((imageData) => {
                    this.filesList.push(imageData);      
                    this.filesListTotal =  this.filesList.length;
                    setTimeout(() => {
                      this.uploadFiles();
                    },500);
                }, (err) => { });
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
