import { Component } from '@angular/core';
import { AlertController, NavController, NavParams, ViewController } from 'ionic-angular';

@Component({
  selector: 'page-nearest-spokes',
  templateUrl: 'nearest-spokes.html',
})
export class NearestSpokesPage {
  centers: any;
  canLeave: boolean  = false;

  constructor(public navCtrl: NavController, public navParams: NavParams, private viewCtrl: ViewController, private alertCtrl: AlertController) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad NearestSpokesPage');
  }

  ionViewWillEnter(){
    this.centers = this.navParams.get("centers");
  }

  ionViewCanLeave() {
    if(this.canLeave){
        //this.viewCtrl.dismiss();
        //this.navCtrl.pop();
    }else{
      this.closeAskQuestionModal();
      return false;
    }
}
  
chooseCenterAndTransit(spokeId){
  this.canLeave = true;
  this.viewCtrl.dismiss({ "spokeId": spokeId });
}

closeAskQuestionModal() {
  let alert = this.alertCtrl.create({
  title: "Cancel Transfer",
  message: "Are you sure you want to exit?",
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

  closeModal(){
    this.viewCtrl.dismiss();
  }

}
