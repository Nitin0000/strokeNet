import { Component, ViewChild} from '@angular/core';
import { NavController, NavParams, Scroll, AlertController, Platform} from 'ionic-angular';
import { UtilitiesProvider } from '../../providers/utilities/utilities';
import { WebApiProvider } from '../../providers/web-api/web-api';
import { CallNumber } from '@ionic-native/call-number';
import { ChatPage } from '../chat/chat';

@Component({
  selector: 'page-online-team',
  templateUrl: 'online-team.html',
})
export class OnlineTeamPage {
  userData: any = {};
  usertokenData: any = {};
  onlineUsers: any = {};


  constructor(public navCtrl: NavController, public navParams: NavParams, public utilities: UtilitiesProvider, public webApi: WebApiProvider, public alertCtrl: AlertController, platform: Platform, private callNumber: CallNumber) {
    this.userData = this.utilities.getLocalObject("userData");
    this.usertokenData = {
      "userId": this.userData.user_id,
      "userToken": this.userData.token
    };
  }


  ionViewDidLoad() {
    console.log('ionViewDidLoad OnlineTeamPage');
  }

  ionViewWillEnter(){    
      this.fetchAllOnlineUsers();
  }


  fetchAllOnlineUsers(){
    this.webApi.fetchAllOnlineUsers(this.usertokenData).then((result) => {
      if (result['data'] && result['data']) {    
        this.onlineUsers = result['data'];
      }
    }, (err) => {
      console.log(JSON.stringify(err, null, "\t"));
      if (err.error.data && err.error.data.message) {
        this.utilities.checksessionExpiryError(err.error.data.message);
      }
    });
  }


  callPhoneNumber(number,name){
    let alert = this.alertCtrl.create({
      title: 'Call',
      message: 'Are you sure you want to make a call to '+name,
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          handler: () => {
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

  openWhatsapp(number){
    window.open("whatsapp://send?phone=91"+number,'_system','location=no');
  }

  startChat(userId){
    this.utilities.showLoading("Please wait...");
    let usertokenData = {"userId" : this.userData.user_id, "userToken" : this.userData.token};
    this.webApi.createInternalConversation(usertokenData, userId).then((result) => {
      this.utilities.hideLoading();
      setTimeout(() => {
        this.navCtrl.push(ChatPage,{chatId: result['data']['firebase_id'], conversationData: result['data']});
      },100);
    }, (err) => {
      this.utilities.hideLoading();
        if(err.error.data && err.error.data.message){ 
          this.utilities.checksessionExpiryError(err.error.data.message);
        }
    });
  }

}
