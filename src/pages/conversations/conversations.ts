import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { UtilitiesProvider } from '../../providers/utilities/utilities';
import { AuthServiceProvider } from '../../providers/auth-service/auth-service';
import { WebApiProvider } from '../../providers/web-api/web-api';
import { Config } from '../../app/app.config';
import { Events } from 'ionic-angular';
import { ChatPage } from '../chat/chat';



@Component({
  selector: 'page-conversations',
  templateUrl: 'conversations.html',
})
export class ConversationsPage {
  userData: any = {};
  conversations: any = {};  

  ActiveChats: boolean =  true;
  ArchivedChats: boolean =  false;

  constructor(public navCtrl: NavController, public navParams: NavParams, public events: Events, private config: Config, public authService: AuthServiceProvider, public webapi: WebApiProvider, public utilities: UtilitiesProvider) {
    this.userData = this.utilities.getLocalObject("userData");
  }
  
  showAllChats() {
      this.ActiveChats = true;
      this.ArchivedChats = false;
  }

  showArchivedChats() {
      this.ActiveChats = false;
      this.ArchivedChats = true;
  }


  doRefresh(refresher) {
      this.conversations = {};
      setTimeout(() => {
          this.getConversations();
          if (refresher) {
              refresher.complete();
          }
      }, 300);
  }

  getConversations(){
      console.log(this.userData.token);
      
      this.utilities.showLoading("Please wait..."); //Show Loader     
      let usertokenData = {"userId" : this.userData.user_id, "userToken" : this.userData.token};        
      this.webapi.getConversations(usertokenData).then((result) => {
          this.conversations = result['data'];           
          this.utilities.hideLoading();             
      }, (err) => {
            if(err.error.data && err.error.data.message){  
                this.utilities.hideLoading();                               
                this.utilities.showAlert("error",err.error.data.message);           
            }
      });
}


  
ionViewWillEnter(){
  this.getConversations();
}

gotoChatPage(chatId){
    this.navCtrl.push(ChatPage, {chatId: chatId});
}

}
