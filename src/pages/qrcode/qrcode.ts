import { Component } from '@angular/core';
import { NavController, NavParams, ViewController } from 'ionic-angular';


@Component({
  selector: 'page-qrcode',
  templateUrl: 'qrcode.html',
})
export class QrcodePage {
  qrCode: string = null;
  constructor(public navCtrl: NavController, public navParams: NavParams, public viewCtrl: ViewController) {
  }

  closeModal(){
    this.viewCtrl.dismiss();
  }
  ionViewWillEnter(){
   this.qrCode = this.navParams.get("code");
  }
  ionViewDidLoad() {
    console.log('ionViewDidLoad QrcodePage');
  }

}
