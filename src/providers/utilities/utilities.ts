import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AlertController, LoadingController, ToastController, Platform, Events} from 'ionic-angular';

@Injectable()
export class UtilitiesProvider {
    loading: any;
    isShowingLoading: boolean = false;
    isAlertShowing: boolean = false;
    alert: any;
    toast: any;
    
  constructor(public http: HttpClient, public alertCtrl: AlertController, public loadingCtrl: LoadingController, public toastCtrl: ToastController, public platform : Platform, public events: Events) {
        console.log('Hello UtilitiesProvider Provider');
  }

  checksessionExpiryError(message){
    if(message === "INVALID_CREDENTIALS"){
      this.events.publish('sessionExpired:logOut');
      return false;
    }else{
      this.showAlert("error", message);
    } 
    return false;
  }

  // LocalStorage
  setLocalItem(key, value){
      localStorage.setItem(key, value);
  }
  
  getLocalItem(key){
      return localStorage[key] || null;
  }
  
  setLocalObject(key, data){
      localStorage.setItem(key, JSON.stringify(data));
  }
  
  getLocalObject(key){
      return JSON.parse(localStorage[key] || '{}');
  }
  
  removeLocalkey(key){
      localStorage.removeItem(key);
  }
  
  clearLocalStorage(){
      localStorage.clear();
  }
  
  showAlert(alerttype, message){
        let AlertTitle = "";
        if(alerttype == "success"){
            AlertTitle = "Success!";
        }else{
            AlertTitle = "Error!";
        }
        this.isAlertShowing = true;
        this.alert = this.alertCtrl.create({
            title: AlertTitle,
            subTitle: message,
            buttons: ['OK']
        });        
        this.alert.onDidDismiss(() => {
          this.isAlertShowing = false;
        });
        this.alert.present();
  }
  
  showLoading(message){
      this.loading = this.loadingCtrl.create({
          content: message
      });
      this.isShowingLoading = true;
      this.loading.onDidDismiss(()=> {
        this.isShowingLoading = false;
      });
      this.loading.present();
      setTimeout(() => {
        this.hideLoading();
      }, 15000);
  }
  
  hideLoading(){      
      if(this.isShowingLoading){
        this.isShowingLoading=false;
        this.loading.dismiss();
      }
  }

  showToast(message, position = 'top'){
    this.toast = this.toastCtrl.create({
        message: message,
        duration: 2500,
        position: position,        
    });
    this.toast.onDidDismiss(() => {
        console.log('Dismissed toast');
      });
    this.toast.present();
  }

  hideToast(){
    this.toast.dismiss();
  }

}
