import { Component, ViewChild} from '@angular/core';
import { NavController, NavParams, Platform, Slides, ViewController } from 'ionic-angular';
import { PhotoViewer } from '@ionic-native/photo-viewer';
import { WebApiProvider } from '../../providers/web-api/web-api';
import { UtilitiesProvider } from '../../providers/utilities/utilities';
import { DomSanitizer } from '@angular/platform-browser';
import { PhotoLibrary } from '@ionic-native/photo-library';
import { SocialSharing } from '@ionic-native/social-sharing';

@Component({
  selector: 'page-image-slider',
  templateUrl: 'image-slider.html',
})
export class ImageSliderPage {
  userData: any = {};
  usertokenData: any = {};

  photoData : any;
  storageDirectory: string = '';
  photos : any;
  ophotos : any;
  photosize: any;
  currentImage: any;
  
  @ViewChild(Slides) slides: Slides;

  constructor(public navCtrl: NavController, public navParams: NavParams, private photoViewer: PhotoViewer, public utilities: UtilitiesProvider, public webApi: WebApiProvider, public sanitizer: DomSanitizer,  public viewCtrl: ViewController, private photoLibrary: PhotoLibrary,private socialSharing: SocialSharing, public platform: Platform) {
    this.userData = this.utilities.getLocalObject("userData");
    this.usertokenData = {
      "userId": this.userData.user_id,
      "userToken": this.userData.token
    };    

    this.photoData = this.navParams.get("images");
    this.photos = new Array(); 
    for (let photo of this.photoData) {
      if(photo.file_type == "jpg"){
        let pData = {
          file_thumb : photo.file_thumb,
          file : photo.file
        };
        this.photos.push(pData);
      }
    }    
    this.photosize = this.sanitizer.bypassSecurityTrustStyle('100% 100%');
  }


  ngAfterViewInit() {
    console.log('ionViewDidLoad ImageSliderPage');
       setTimeout(() => {
        this.slides.update();
        this.slides.slideTo(this.navParams.get("currentslide"), 500);
        this.currentImage = this.navParams.get("currentslide");
       },250);      
  }

   slideChanged() {
      let currentIndex = this.slides.getActiveIndex();
      console.log('Current index is', currentIndex);
      this.currentImage = currentIndex;        
   }
  showBigImage(){
      this.photoViewer.show(this.currentImage);
  }

  goBack(){
    this.navCtrl.pop();
  }

  
  shareImage(){
    let imageUrl = this.photos[this.currentImage].file;
    let image =   imageUrl.replace("thumb/compress.php?src=/", "");
    let finalImage = image.replace("&w=1000&zc=1", "");

    console.log(JSON.stringify(finalImage, null, "\t"));
    console.log("Share Image with someone");

    this.platform.ready().then(() => {
      this.socialSharing.share(null, null, finalImage, null).then(() => {
        // Success!
      }).catch(() => {
        // Error!
      });
  });

  }

  downloadImage(){    
    let imageUrl = this.photos[this.currentImage].file;
    let image =   imageUrl.replace("thumb/compress.php?src=/", "");
    let finalImage = image.replace("&w=1000&zc=1", "");
    this.utilities.showLoading("Saving image...");
    this.photoLibrary.requestAuthorization().then(() => {
      this.photoLibrary.saveImage(finalImage, "StrokeNetChandigarh").then(() => {
        this.utilities.hideLoading();
        this.utilities.showAlert("success", "Image saved to gallery");
      })
      .catch(err => console.log('permissions weren\'t granted'));
    })
    .catch(err => {
      this.utilities.showLoading("Permission not granted");
    });
  }

}
