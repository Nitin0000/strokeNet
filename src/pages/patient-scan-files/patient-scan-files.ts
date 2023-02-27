import { Component } from '@angular/core';
import { NavController, NavParams, ActionSheetController, LoadingController, AlertController, ModalController, Platform } from 'ionic-angular';

import { WebApiProvider } from '../../providers/web-api/web-api';
import { UtilitiesProvider } from '../../providers/utilities/utilities';

import { Camera, CameraOptions } from '@ionic-native/camera';
import { FileTransfer, FileUploadOptions, FileTransferObject } from '@ionic-native/file-transfer';
import { File } from '@ionic-native/file';
import { Config } from '../../app/app.config';
import { ImagePicker, ImagePickerOptions} from '@ionic-native/image-picker';

import { DomSanitizer} from '@angular/platform-browser';
import { ImageViewerController } from 'ionic-img-viewer';
import { PhotoViewer } from '@ionic-native/photo-viewer';
import { MediaCapture, MediaFile, CaptureError, CaptureVideoOptions } from '@ionic-native/media-capture';
import { StreamingMedia, StreamingVideoOptions } from '@ionic-native/streaming-media';
import { ImageSliderPage } from '../image-slider/image-slider';

import { AndroidPermissions } from '@ionic-native/android-permissions';


@Component({
  selector: 'page-patient-scan-files',
  templateUrl: 'patient-scan-files.html',
})
export class PatientScanFilesPage {
  selectedTab: string = 'ncct';
  pageTitle: string = 'NCCT';

  loading: any;
  isShowingLoading: boolean = false;

  patientFiles: any = {};
  userData: any = {};
  usertokenData: any = {};

  currentFilesData : any = {};
  filesList : any = [];
  filesListTotal : any = 0;
  currentUploadIndex: any = 1;
  imagesFolder: any = null;
  sanitize: any ;
  aspectsNumber: string = "";

  finalid : any;


  _imageViewerCtrl: ImageViewerController;
  
  constructor(public navCtrl: NavController, public navParams: NavParams, public utilities: UtilitiesProvider, public webApi: WebApiProvider, private actionSheetCtrl: ActionSheetController,  private camera: Camera,private file: File, private transfer: FileTransfer, private config: Config, private imagePicker: ImagePicker, private loadingCtrl: LoadingController, private sanitizer: DomSanitizer, public alertCtrl: AlertController, imageViewerCtrl: ImageViewerController, private photoViewer: PhotoViewer, private mediaCapture: MediaCapture, private streamingMedia: StreamingMedia, private modalCtrl: ModalController,  private platform: Platform, private androidPermissions: AndroidPermissions) {
    this.userData = this.utilities.getLocalObject("userData");
    this.usertokenData = {
      "userId": this.userData.user_id,
      "userToken": this.userData.token
    };

    this.sanitize = sanitizer;
    this.imagesFolder = this.config.imagesFolder;

    this._imageViewerCtrl = imageViewerCtrl;
  }

  getPatientFiles(patientId){    
    this.webApi.getSinglePatient(this.usertokenData, patientId).then((result) => {
      if (result['data'] && result['data']) {
       this.patientFiles = result['data']['patient_files'];
       this.currentFilesData = this.patientFiles[this.selectedTab];  


       this.currentFilesData.forEach((element, key) => {            
          this.currentFilesData[key]['downloading'] = false;
          let videoUrl = element.file;  
          let videoUrlArray = videoUrl.split("/");
          let videoFileName = videoUrlArray[videoUrlArray.length - 1];
          this.file.checkFile(this.file.dataDirectory,  videoFileName).then(file => {      
            this.currentFilesData[key]['downloaded'] = true;
          }).catch(noFile => {             
            this.currentFilesData[key]['downloaded'] = false;
          });
        });


       
      }
    }, (err) => {
      if (err.error.data && err.error.data.message) {
        this.utilities.showAlert("error", err.error.data.message);
      }
    });
  }
  
  ionViewWillEnter(){
    this.getPatientFiles(this.navParams.get("patientId"));

    this.aspectsNumber = this.navParams.get("aspectsNumber");
    this.selectedTab = this.navParams.get("scanType");
  
    if(this.selectedTab == "ncct"){
      if(this.aspectsNumber){
        this.pageTitle = this.navParams.get("pageTitle")+" ("+this.aspectsNumber+")";
      }else{
        this.pageTitle = this.navParams.get("pageTitle");
      }
    }else{
      this.pageTitle = this.navParams.get("pageTitle");
    }
    this.currentFilesData = this.patientFiles[this.selectedTab];   

    // this.currentFilesData.forEach((element, key) => {            
    //   this.currentFilesData[key]['downloading'] = false;
    //   let videoUrl = element.file;  
    //   let videoUrlArray = videoUrl.split("/");
    //   let videoFileName = videoUrlArray[videoUrlArray.length - 1];
    //   this.file.checkFile(this.file.dataDirectory,  videoFileName).then(file => {      
    //     this.currentFilesData[key]['downloaded'] = true;
    //   }).catch(noFile => {             
    //     this.currentFilesData[key]['downloaded'] = false;
    //   });
    // });

  }

  // changeTab(tab){
  //     this.selectedTab = tab;
  //     this.currentFilesData = this.patientFiles[this.selectedTab];

  //     // this.currentFilesData.forEach((element, key) => {            
  //     //   this.currentFilesData[key]['downloading'] = false;
  //     //   let videoUrl = element.file;  
  //     //   let videoUrlArray = videoUrl.split("/");
  //     //   let videoFileName = videoUrlArray[videoUrlArray.length - 1];
  //     //   this.file.checkFile(this.file.dataDirectory,  videoFileName).then(file => {      
  //     //     this.currentFilesData[key]['downloaded'] = true;
  //     //   }).catch(noFile => {             
  //     //     this.currentFilesData[key]['downloaded'] = false;
  //     //   });
  //     // });
  // }

  ionViewDidLoad() {
    console.log('ionViewDidLoad PatientScanFilesPage');
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

  deleteFile(fileId){
    let alert = this.alertCtrl.create({
      title: 'Delete file',
      message: 'Are you sure you want to delete this file?',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          handler: () => {
            console.log('Cancel clicked');
          }
        },
        {
          text: 'Delete',
          handler: () => {
            let fileData = {
              "file_id": fileId
            }
            this.webApi.deletePatientFile(this.usertokenData, fileData).then((result) => {
              if (result['data'] && result['data'] === "file_deleted") {
               console.log("File deleted to database");
               this.getPatientFiles(this.navParams.get("patientId"));               
              }
            }, (err) => {
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
          params: {'module_type' : 'patient_file'}
        }
        
        fileTransfer.upload(this.filesList[0], this.config.imageUploadUrl, options)
        .then((data) => {
            let imagedata = JSON.parse(data.response);

            let save_path = imagedata.data.save_path;
            let file_type = imagedata.data.file_type;

            let fileData = {
              'file' : save_path,   
              'file_type' : file_type,
              'scan_type' : this.selectedTab,              
              'patient_id' : this.navParams.get("patientId")
            };

            this.webApi.addPatientScanFile(this.usertokenData, fileData).then((result) => {
              if (result['data'] && result['data'] && result['data']['message'] === "file_uploaded") {
               if(this.currentUploadIndex < this.filesListTotal){
                  this.currentUploadIndex = this.currentUploadIndex + 1;
                  this.loading.setContent("Uploading files : ("+this.currentUploadIndex+"/"+this.filesListTotal+")");                           
                }
                //Remove the first entry from the filesList
                this.filesList.shift();
                setTimeout(() => {
                  this.uploadFiles();
                },1000);
              }
            }, (err) => {
              if (err.error.data && err.error.data.message) {
                this.utilities.showAlert("error", err.error.data.message);
              }
            });            
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
        
        // Send Scans Uploaded Alert to everyone
        this.webApi.scansUploadedAlertToTeam(this.usertokenData,{"patient_id" : this.navParams.get("patientId") }).then((result) => {
              this.utilities.hideLoading();    
              if(result['data'] && result['data']['message']){                  
                this.getPatientFiles(this.navParams.get("patientId"));
                this.utilities.showToast("Files uploaded & Alert Sent to the team", "bottom");
              }
          }, (err) => {
            this.utilities.hideLoading();     
            if(err.error.data && err.error.data.message){                   
                this.utilities.showAlert("error",err.error.data.message);   
            }
        }); 
      }
}

recordVideo(){
  if (this.platform.is('android')) {
    this.androidPermissions.checkPermission(this.androidPermissions.PERMISSION.WRITE_EXTERNAL_STORAGE).then(
      result => {
        
      },
      err => this.androidPermissions.requestPermissions([this.androidPermissions.PERMISSION.WRITE_EXTERNAL_STORAGE, this.androidPermissions.PERMISSION.READ_EXTERNAL_STORAGE, this.androidPermissions.PERMISSION.RECORD_AUDIO, 
        this.androidPermissions.PERMISSION.RECORD_VIDEO
        ])
    );
  }  
  let options: CaptureVideoOptions = { limit: 1, duration : 15}
  this.mediaCapture.captureVideo(options)
    .then(
      (data: MediaFile[]) => {
        console.log(JSON.stringify(data, null, "\t"));
        this.filesList.push(data[0].fullPath);      
        this.filesListTotal =  this.filesList.length;
        setTimeout(() => {
          this.uploadFiles();
        },500);
      },
      (err: CaptureError) => {
        console.log(JSON.stringify(err, null, "\t"));
      }
    );
}

presentVideosActionSheet(){
  let actionSheet = this.actionSheetCtrl.create({
    title: "Upload",
    buttons: [      
      {
        text: "Record a Video",
        handler: () => {
           let options: CaptureVideoOptions = { limit: 1, duration : 15}
            this.mediaCapture.captureVideo(options)
              .then(
                (data: MediaFile[]) => {
                  this.filesList.push(data[0].fullPath);      
                  this.filesListTotal =  this.filesList.length;
                  if(this.filesList.length > 0){
                    setTimeout(() => {
                      this.uploadFiles();
                    },500);
                  }
                },
                (err: CaptureError) => {
                  console.log(JSON.stringify(err, null, "\t"));
                }
              );
        }
      },
      {
        text: "Pick from Gallery",
        handler: () => {
              const options: CameraOptions = {
                sourceType: this.camera.PictureSourceType.PHOTOLIBRARY,
                destinationType: this.camera.DestinationType.FILE_URI,  
                mediaType: this.camera.MediaType.VIDEO,  
                quality: 70,
                correctOrientation: true,
              }
              this.camera.getPicture(options).then((videoURI) => {
                this.filesList.push(videoURI);      
                this.filesListTotal =  this.filesList.length;

                if(this.filesList.length > 0){
                  setTimeout(() => {
                    this.uploadFiles();
                  },500);
                }
                            
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
                  quality: 75,
                  // targetWidth: 500,
                  // targetHeight: 500,
                  encodingType: this.camera.EncodingType.JPEG,      
                  correctOrientation: true,
                  // allowEdit: true
                }
                this.camera.getPicture(options).then((imageData) => {
                  this.filesList.push(imageData);      
                  this.filesListTotal =  this.filesList.length;
                  if(this.filesList.length > 0){
                    setTimeout(() => {
                      this.uploadFiles();
                    },500);
                  }
                              
                }, (err) => {
                 // Handle error
                });
          }
        },
        
       
        {
          text: "Pick from Gallery",
          handler: () => {
                console.log("Pick multiple files from Gallery!");
                const options : ImagePickerOptions= {
                  maximumImagesCount : 20
                };
                this.imagePicker.getPictures(options).then((results) => {
                    for (var i = 0; i < results.length; i++) {    
                      console.log(results[i]);                  
                      this.filesList.push(results[i]);
                      this.filesListTotal =  this.filesList.length;
                    }                    
                    if(this.filesList.length > 0){
                      setTimeout(() => {
                        this.uploadFiles();
                      },500);
                    }
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

  downloadVideo(fileData, main, secondary){
    let arrayrecordId = 0; 

    this.currentFilesData.forEach((element, key) => {
        if(element.id == fileData.id){
          arrayrecordId = key;
        }
    });

    let videoUrl = fileData.file;  
    let videoUrlArray = videoUrl.split("/");
    let videoFileName = videoUrlArray[videoUrlArray.length - 1];

    this.file.checkFile(this.file.dataDirectory,  videoFileName).then(file => {      
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

  playVideo(videoPath){    
    let options: StreamingVideoOptions = {
      successCallback: () => { console.log('Video played') },
      errorCallback: (e) => { console.log('Error streaming') },
      shouldAutoClose: true,
      controls: false
    };
    this.streamingMedia.playVideo(videoPath, options);
  }

  presentImageActions(image) {        
    let actionSheet = this.actionSheetCtrl.create({
      // title: "Image actions",
      buttons: [
        {
          text: "View",
          handler: () => {
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
        },
        {
          text: "Delete",
          handler: () => {
            this.deleteFile(image.id);
          }
        },{
          text: "Move",
          handler: () => {
               
            let scan_types = [
              {
                type: 'radio',
                checked: false,
                label : 'NCCT',
                value: 'ncct'
              },
              {
                type: 'radio',
                checked: false,
                label : 'CT Angiography',
                value: 'cta_ctp'
              },
              {
                type: 'radio',
                checked: false,
                label : 'MRI',
                value: 'mri'
              },
              {
                type: 'radio',
                checked: false,
                label : 'MRA',
                value: 'mra'
              }                 
            ];

            let alert = this.alertCtrl.create({
              title: "Move file",
              message : 'Which section would you like to move the file?',
              inputs: scan_types,
              buttons: [
                {
                  text: "Cancel",
                  role: 'cancel',
                  handler: data => {
                    console.log('Cancel clicked');
                  }
                },
                {
                  text: "Move",
                  handler: data => {       
                    console.log(data);       
                    let fileData = {
                      'file_id' : image.id,
                      'scan_type' : data
                    };
                    this.webApi.movePatientFile(this.usertokenData, fileData).then((result) => {
                      console.log(JSON.stringify(result, null, "\t"));

                      if (result['data'] && result['data'] === "file_moved") {
                       console.log("File moved to "+data);
                       this.getPatientFiles(this.navParams.get("patientId"));               
                      }
                    }, (err) => {
                      console.log(JSON.stringify(err, null, "\t"));
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

  openImageinModal(main, secondary){
      this.finalid =  parseInt((main + main) + secondary);
      let photoModal = this.modalCtrl.create(ImageSliderPage, {currentslide:  this.finalid, images: this.currentFilesData });
      photoModal.present();
  }

}
