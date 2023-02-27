import { Component, ViewChild } from '@angular/core';
import { NavController, NavParams, Content, ActionSheetController, Events, ToastController, AlertController } from 'ionic-angular';

import { AngularFireDatabase, AngularFireList } from 'angularfire2/database';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';

import { OneSignal } from '@ionic-native/onesignal';

import { UtilitiesProvider } from '../../providers/utilities/utilities';
import { AuthServiceProvider } from '../../providers/auth-service/auth-service';
import { WebApiProvider } from '../../providers/web-api/web-api';

@Component({
  selector: 'page-chat',
  templateUrl: 'chat.html',
})
export class ChatPage {
    messagesRef: AngularFireList<any>;
    messages: Observable<any[]>;
    
    chatId:any = null;    
    userData: any = {};   
    newMessageData: any = {"user_id" : null, "message": "", "created": null, "image" : null};
    conversationData: any = {};
    otherUserId: any = null;
    otherUserName: any = null;
    showFooter:boolean = true;
    chatKeys:any = [];
    
    @ViewChild(Content) content: Content;
    @ViewChild('chatinput') myInput;


  constructor(public navCtrl: NavController, public navParams: NavParams, private db: AngularFireDatabase, public utilities: UtilitiesProvider, public authService:AuthServiceProvider, public webapi: WebApiProvider, public actionSheetCtrl: ActionSheetController, public events : Events, public toastCtrl: ToastController, public alertCtrl: AlertController, private oneSignal: OneSignal) {
      this.userData = this.utilities.getLocalObject("userData");  

      this.oneSignal.inFocusDisplaying(this.oneSignal.OSInFocusDisplayOption.None);

      this.messagesRef = this.db.list('chats/'+ this.navParams.data.chatId);      

      this.messagesRef.stateChanges().subscribe(changes => {
        setTimeout(() => {
          setTimeout(() => {
              this.content.resize();
          }, 100);
             this.content.scrollToBottom(300);
        }, 700);
        
      });

      this.messages = this.messagesRef.snapshotChanges().map(changes => {
        return changes.map(c => ({ key: c.payload.key, message: c.payload.val() }));
      });

      setTimeout(() => {
        this.messages.forEach(element => {
          element.forEach(message => {            
            if(message.message.user_id !== this.userData.user_id){
              this.db.list('chats/'+this.chatId).update(message.key, {'read_by_user' : true});
            }
          });          
        });
      },2000);
  }

  getChatMessages(chatId){
      
  }

  ionViewLoaded() {
      setTimeout(() => {
        this.myInput.setFocus();
      },150);
  }

  ionViewWillEnter() {
    this.chatId = this.navParams.data.chatId;    
    this.getConversationData();
  }
  
  ionViewDidLeave(){
    this.oneSignal.inFocusDisplaying(this.oneSignal.OSInFocusDisplayOption.Notification);
  }
  
  removeKeyfromFB(keyval){
      this.db.list('chats/'+this.chatId).update(keyval, {[this.userData.user_id] : false});
  }
  
  onLongPress(ev, keyval, messageUserId){
    
      console.log(keyval);

      if(this.userData.user_id !== messageUserId){
        return false;
      }

      if(this.conversationData.chat_blocked || this.conversationData.chat_left){
        return false;
      }

        let actionSheet = this.actionSheetCtrl.create({
        buttons: [   
            {
                text: "Delete Message",
                handler: () => {
                    let singlemessageRef = this.db.list('chats/'+this.chatId+'/'+keyval);
                    //singlemessageRef.update(keyval, {[this.userData.user_id] : false});
                    singlemessageRef.remove();
                }
            },
            {
                text: "Cancel",
                role: 'cancel',
                handler: () => {
                    console.log('Cancel clicked');
                }
            }
        ]
        });
        actionSheet.present();
  }
  

  leaveConversation(otherUserId){
    let alert = this.alertCtrl.create({
      title:  "Leave Conversation",
      message:  "Are you sure you want to leave this conversation. You wont be able to start conversation with this user again.",      
      buttons: [
        {
          text: "Cancel",
          role: 'cancel',
          handler: data => {
            console.log('Cancel clicked');
          }
        },
        {
          text: "Leave",          
          handler: data => {
             // API hit to remove conversation from database
             let usertokenData = {"userId" : this.userData.user_id, "userToken" : this.userData.token};
             this.webapi.deleteConversation(usertokenData, this.chatId, otherUserId).then((result) => {

               if(result['data'] && result['data']['message'] && result['data']['message'] == "DELETED"){
                   // let singlemessageRef = this.db.list('chats/'+this.chatId);
                   // singlemessageRef.remove();
                   this.utilities.showToast("Conversation left!");                   
                   this.navCtrl.pop();
               }   
              
              
             }, (err) => {   
                 if(err.error.data && err.error.data.message){ 
                   this.utilities.showAlert("error",err.error.data.message); 
                 }  
             });    
          }
        }
      ]
    });
    alert.present();

  }

  
  getConversationData(){
      let usertokenData = {"userId" : this.userData.user_id, "userToken" : this.userData.token};
      this.webapi.getConversation(usertokenData, this.chatId).then((result) => {
            this.conversationData = result['data'];     
                              
            if(this.userData.user_id === result['data']['user_id']){
                this.otherUserId = result['data']['other_user_id'];
                this.otherUserName = result['data']['username'];
            }else{
                this.otherUserId = result['data']['user_id'];
                this.otherUserName = result['data']['username'];
            }
            
            if(result['data']['blocked_conversation']){
                this.showFooter = false;
                
                setTimeout(() => {
                    this.content.resize();
                }, 100);
                
                
            }else{
                 this.showFooter = true;
                 setTimeout(() => {
                    this.content.resize();
                }, 100);
            }
            
        }, (err) => {            
        });
  }
  

  ionViewDidLoad() {
    console.log('ionViewDidLoad ChatPage');
  }
  
  sendMessage(){
      console.log(JSON.stringify(this.newMessageData, null, "\t"));

      if(!this.newMessageData.message || this.newMessageData.message.trim() === ""){
          return false;
      }
      this.newMessageData.created = new Date().getTime();
      this.newMessageData.user_id = this.userData.user_id;
      
        let usertokenData = {"userId" : this.userData.user_id, "userToken" : this.userData.token};       
        let lastmessageData = {"last_message": this.newMessageData.message};

        setTimeout(() => {
          this.myInput.setFocus();
        },0);

        // console.log(JSON.stringify(lastmessageData, null, "\t"));
        // console.log(this.chatId);

        this.webapi.createLastMessageInConversation(usertokenData, this.chatId, lastmessageData).then((result) => {
            if(result['data'] &&  result['data']['message'] && result['data']['message'] === "UNABLE_TO_MESSAGE"){
                this.showFooter = false;
                setTimeout(() => {
                    this.content.resize();
                }, 100);
            }else{
              this.conversationData.chat_left = result['data']['quick_checks']['chat_left'];
              this.conversationData.chat_blocked = result['data']['quick_checks']['chat_blocked'];
              this.conversationData.status = result['data']['quick_checks']['status'];

              this.webapi.sendPushMessageChat(usertokenData, this.chatId, lastmessageData).then((result) => {
              }, (err) => {
                console.log(JSON.stringify(err, null, "\t"));
              }); 

              this.newMessageData[this.conversationData.other_user_id] = true;
              this.newMessageData[this.conversationData.user_id] = true;
              this.newMessageData['read_by_user'] = false;


              if(this.newMessageData.message !== ""){
                this.db.list('chats/'+this.chatId).push(this.newMessageData);
                this.newMessageData = {"user_id" : this.userData.user_id, "message": "", "created": null}; 

                setTimeout(() => {
                  this.messages.forEach(element => {
                    element.forEach(message => {            
                      if(message.message.user_id !== this.userData.user_id){
                        this.db.list('chats/'+this.chatId).update(message.key, {'read_by_user' : true});
                      }
                    });                    
                  });
                },2000);

                setTimeout(() => {
                    this.content.resize();
                }, 500);
                
                setTimeout(() => {
                  this.content.scrollToBottom(300);
                }, 1000);
              }
            }
        }, (err) => {
          console.log("Error happened while posting last message in database");
          console.log(JSON.stringify(err, null, "\t"));
        });  
  }
  
  
  blockUser(userId){
    let blocunblocktext = "";
    let blocunblocksubtext = "";
    let blocked = false;
    let inputs = [];

    if(this.conversationData.blocked_conversation){
      blocunblocktext = "Unblock User";
      blocunblocksubtext = "unblock";
      blocked = true;
    }else{
      blocunblocktext = "Block/Report User";
      blocunblocksubtext = "block";
      blocked = false;
      inputs = [
        {
          name: 'reason',
          placeholder:  "Reason of blocking",
          type: 'textarea'
        }              
      ];
    }

    let alert = this.alertCtrl.create({
      title:  blocunblocktext,
      message:  "Are you sure you want to "+blocunblocksubtext+" this user?",   
      inputs: inputs,   
      buttons: [
        {
          text: "Cancel",
          role: 'cancel',
          handler: data => {
            console.log('Cancel clicked');
          }
        },
        {
          text: blocunblocktext,          
          handler: data => {
            let reasonData = {
                reason : null,
                event_id : this.conversationData.event_info.id
            };

            if(data && data.reason){
              reasonData.reason = data.reason;
            }else{
              reasonData.reason = null;
            }

            let usertokenData = {"userId" : this.userData.user_id, "userToken" : this.userData.token};
            this.webapi.blockUnlockUser(usertokenData, userId, reasonData).then((result) => {                        
                  let toast = this.toastCtrl.create({
                      message: result['data']['message'],
                      duration: 2000,
                      position: 'top'
                  });
                  toast.present();
                  this.getConversationData();

                  if(result['data']['blocked']){
                    this.navCtrl.pop();
                  }
                
              }, (err) => {
                  if(err.error.data && err.error.data.message){ 
                    this.utilities.showAlert("error",err.error.data.message); 
                  }
              });
          }
        }
      ]
    });
    alert.present();
  }
  
  
  // flagUser(object_type, object_id){
  //     let alert = this.alertCtrl.create({
  //           title:  "Report",
  //           message:  "Are you sure you want to report this "+object_type+"?",
  //           inputs: [
  //             {
  //               name: 'reason',
  //               placeholder:  "Reason of reporting",
  //               type: 'textarea'
  //             }              
  //           ],
  //           buttons: [
  //             {
  //               text: "Cancel",
  //               role: 'cancel',
  //               handler: data => {
  //                 console.log('Cancel clicked');
  //               }
  //             },
  //             {
  //               text: 'Report',
  //               handler: data => {
  //                   let reportData = {
  //                       "report_type" : object_type,
  //                       "report_id" : object_id,
  //                       "reason": null
  //                   }                    
  //                   reportData.reason = data.reason;                    
  //                   let usertokenData = {"userId" : this.userData.user_id, "userToken" : this.userData.token};
  //                   this.webapi.reportObject(usertokenData, reportData).then((result) => {
  //                         let alert = this.alertCtrl.create({
  //                             title: result['data']['message'],
  //                             subTitle: "Report sent to the admin",
  //                             buttons: ["OK"]
  //                         });
  //                         alert.present();
  //                   }, (err) => {
  //                         if(err.error.data && err.error.data.message){                   
  //                             this.utilities.showAlert("error",err.error.data.message);      
  //                           }
  //                   });
  //               }
  //             }
  //           ]
  //         });
  //         alert.present();
  // }

  openActionSheet(){

    let actionButtons = [];

    if(!this.conversationData.chat_blocked || this.conversationData.chat_block_user_id == this.userData.user_id){
      if(this.conversationData.chat_block_user_id == this.userData.user_id){
        let unblockButton = {
          text: 'Unblock user',
          handler: () => {
            this.blockUser(this.otherUserId);
          }
        };
        actionButtons.push(unblockButton);
      }else{
        let blockButton = {
          text: 'Block User',
          handler: () => {
            this.blockUser(this.otherUserId);
          }
        };
        actionButtons.push(blockButton);
      }
      
    }
    
    // let reportUserButton = {
    //   text: 'Report User',
    //   handler: () => {        
    //     this.flagUser('user', this.otherUserId);
    //   }
    // };
    // actionButtons.push(reportUserButton);

    //Check If Not Left
    if(!this.conversationData.chat_left && !this.conversationData.chat_blocked){
      let leaveConversationButton = {
        text: 'Leave Conversation',
        role: 'destructive',
        handler: () => {
          // this.leaveConversation(this.otherUserId);

          // API hit to remove conversation from database
          let usertokenData = {"userId" : this.userData.user_id, "userToken" : this.userData.token};
          this.webapi.deleteConversation(usertokenData, this.chatId, this.otherUserId).then((result) => {

            if(result['data'] && result['data']['message'] && result['data']['message'] == "DELETED"){
                // let singlemessageRef = this.db.list('chats/'+this.chatId);
                // singlemessageRef.remove();
                this.utilities.showToast("Conversation left!");                   
                this.navCtrl.pop();
            }   
           
           
          }, (err) => {   
              if(err.error.data && err.error.data.message){ 
                this.utilities.showAlert("error",err.error.data.message); 
              }  
          }); 

        }
      };
      actionButtons.push(leaveConversationButton);
    }


    let CancelButton = {
      text: 'Cancel',
      role: 'cancel',
      handler: () => {
        console.log('Cancel clicked');
      }
    };
    actionButtons.push(CancelButton);

    let actionSheet = this.actionSheetCtrl.create({
      // title: 'Take an action',
      buttons:  actionButtons,      
    });
 
    actionSheet.present();
  }

}