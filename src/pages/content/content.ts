import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';

import { WebApiProvider } from '../../providers/web-api/web-api';
import { UtilitiesProvider } from '../../providers/utilities/utilities';

@Component({
  selector: 'page-content',
  templateUrl: 'content.html',
})
export class ContentPage {
  page: any = {};

  constructor(public navCtrl: NavController, public navParams: NavParams, public webApi: WebApiProvider, public utilities: UtilitiesProvider) {
  }
  ionViewWillEnter(){
    this.getPage(this.navParams.get("pageId"));
    console.log(this.navParams.get("pageId"));
  }

  getPage(pageId){
    this.webApi.getSinglePage(pageId).then((result) => {
      this.page = result['data'];
    }, (err) => {
       this.utilities.hideLoading();     
       if(err.error.data && err.error.data.message){                   
           this.utilities.showAlert("error",err.error.data.message);   
       }
   });
  }
  

  ionViewDidLoad() {
    console.log('ionViewDidLoad ContentPage');
  }

}
