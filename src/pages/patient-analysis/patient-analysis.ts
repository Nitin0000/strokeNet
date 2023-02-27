import { Component, ViewChild} from '@angular/core';
import { NavController, NavParams, Scroll, AlertController, Platform} from 'ionic-angular';
import { UtilitiesProvider } from '../../providers/utilities/utilities';
import { WebApiProvider } from '../../providers/web-api/web-api';
import { CallNumber } from '@ionic-native/call-number';
import { ChatPage } from '../chat/chat';


@Component({
  selector: 'page-patient-analysis',
  templateUrl: 'patient-analysis.html',
})
export class PatientAnalysisPage {
  userData: any = {};
  usertokenData: any = {};

  patient: any = {};
  selectedSectionTab: string = 'status';
  
  comments: any = [];
  commentData : any = {};

  conclusionTypes: any = [];
  conclusionTypeValues: any = [];
  postedOutcomes: any = [];

  patientDischarged: boolean = false;
  patientExpired: boolean = false;

  transitionStatuses: any = [];
  available_statuses: any = [];
  transitionStatusData: any = {};

  onlineUsers: any = {};
  onlineHubUsers: any = {};
  onlineSpokeUsers: any = {};

  scrollHeight: any = "400px";
  selectedTransitionStatus : any = null;
 
  selectedConclusionType: string = "Outcome";
  selectedConclusionValue: any = null;

  @ViewChild('chatScroll') chatScroll: Scroll;

  constructor(public navCtrl: NavController, public navParams: NavParams, public utilities: UtilitiesProvider, public webApi: WebApiProvider, public alertCtrl: AlertController, platform: Platform, private callNumber: CallNumber) {

    this.userData = this.utilities.getLocalObject("userData");

    this.usertokenData = {
      "userId": this.userData.user_id,
      "userToken": this.userData.token
    };

    platform.ready().then((readySource) => {
      console.log('Width: ' + platform.width());
      console.log('Height: ' + platform.height());
      this.scrollHeight = (platform.height() - 200)+"px";
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

  public scrollToTop(scroll) {
    scroll.scrollTop = 0;
  }

  public scrollToBottom(scroll) {
    scroll.scrollTop = scroll.scrollHeight - scroll.clientHeight;
  }

  goBottomBtnClick() {
      this.scrollToBottom(this.chatScroll._scrollContent.nativeElement);
  }

  changeTab(tab){
    this.selectedSectionTab = tab;

    if(tab == "comments"){
      this.getComments();
    }
    if(tab == "users_online"){
      this.getOnlineUsers();
    }
  }
  ionViewWillEnter(){
      this.getSinglePatientDetails(this.navParams.get("patientId"));
      this.getTransitionStatuses();
      this.getConclusionTypes();

      if(this.navParams.get("gotoTab")){
        this.changeTab(this.navParams.get("gotoTab"));
      }
      // this.addRemoveFromOnlineUsers("add");      
      this.getComments();
  }
  
  // Remove the users from Online User when they navigate to other page
  ionViewWillLeave(){
    // this.addRemoveFromOnlineUsers("remove");
  }

  onChangeTransitionStatus(event){
  
    for(let i= 0; i <= this.available_statuses.length; i++){
      if(this.available_statuses[i] && this.available_statuses[i].id && this.available_statuses[i].id == event){
       
        let alert = this.alertCtrl.create({
          title: this.available_statuses[i].title,
          message: 'Are you sure you want to update the status.',
          buttons: [
            {
              text: 'Cancel',
              role: 'cancel',
              handler: () => {
                this.selectedTransitionStatus = null;
              }
            },
            {
              text: 'Update',
              handler: () => {
                  // Update the tranistion status api here
                    this.transitionStatusData.patient_id = this.navParams.get("patientId");
                    this.transitionStatusData.status_id = event;

                    if(!this.transitionStatusData.status_id || this.transitionStatusData.status_id === ""){
                        return false;
                    }
                    this.utilities.showLoading("Please wait...");

                    this.webApi.postTransitionStatus(this.usertokenData, this.transitionStatusData).then((result) => {
                      if (result['data'] && result['data']) {    
                        this.utilities.showToast(result['data']['message'], "top");

                        if(result['data']['transition_statuses']){
                          this.transitionStatuses = result['data']['transition_statuses']['punched'];

                          if(result['data']['transition_statuses']['available'] !== null){
                            this.available_statuses = result['data']['transition_statuses']['available'];
                          }else{
                            this.available_statuses = {};
                          }
                          
                        }

                        setTimeout(() => {
                          this.selectedTransitionStatus = null;
                          this.utilities.hideLoading();
                        },500);                        

                      }
                    }, (err) => {
                      if (err.error.data && err.error.data.message) {
                        this.utilities.checksessionExpiryError(err.error.data.message);
                      }
                    });
                
              }
            }
          ]
        });
        alert.present();
      }
    }
  }

  getOnlineUsers(){
    this.webApi.getOnlineUsers(this.usertokenData, this.navParams.get("patientId")).then((result) => {
      if (result['data'] && result['data']) {    
        this.onlineHubUsers = result['data']['hub_users'];
        this.onlineSpokeUsers = result['data']['spoke_users'];
      }
    }, (err) => {
      if (err.error.data && err.error.data.message) {
        this.utilities.checksessionExpiryError(err.error.data.message);
      }
    });
  }


  addRemoveFromOnlineUsers(add_remove){
    this.webApi.addRemoveFromOnlineUsers(this.usertokenData, this.navParams.get("patientId"), add_remove).then((result) => {
      if (result['data'] && result['data']) {    
        this.onlineUsers = result['data'];
      }
    }, (err) => {
      if (err.error.data && err.error.data.message) {
        this.utilities.checksessionExpiryError(err.error.data.message);
      }
    });
  }

  

  getTransitionStatuses(){
    this.webApi.getTransitionStatuses(this.usertokenData, this.navParams.get("patientId")).then((result) => {
      if (result['data'] && result['data']) {    
        this.utilities.hideLoading();        
        this.transitionStatuses = result['data']['punched'];
        this.available_statuses = result['data']['available'];
      }
    }, (err) => {
      if (err.error.data && err.error.data.message) {
        this.utilities.checksessionExpiryError(err.error.data.message);
      }
    });
  }

  cancelConclusionTypes(){
    // this.selectedConclusionType = null;
    this.selectedConclusionValue = null;
  }


  saveConclusionValue(){
    if(!this.selectedConclusionType || this.selectedConclusionType === ""){
        return false;
    }
    if(!this.selectedConclusionValue || this.selectedConclusionValue === ""){
        return false;
    }

    let alert = this.alertCtrl.create({
      title: "Update Outcome?",
      message: 'Are you sure you want to update the outcome.',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          handler: () => {
              this.selectedConclusionType = null;
              this.selectedConclusionValue = null;
          }
        },
        {
          text: 'Update',
          handler: () => {
              this.utilities.showLoading("Please wait...");
              let conclusionData = {
                "patient_id" : this.navParams.get("patientId"),
                "conclusion_type" : this.selectedConclusionType,
                "conclusion_value" :this.selectedConclusionValue,
              }
              this.webApi.postConclusion(this.usertokenData, conclusionData).then((result) => {
                if (result['data'] && result['data']) {    
                  this.utilities.hideLoading();
                  this.utilities.showToast(result['data']['message']);

                  this.selectedConclusionType = "Outcome";
                  this.selectedConclusionValue = null;
                }
              }, (err) => {
                 this.utilities.hideLoading();
                if (err.error.data && err.error.data.message) {
                  this.utilities.checksessionExpiryError(err.error.data.message);
                }
              });
          }
        }
      ]
    });
    alert.present();
  }

  getConclusionTypes(){
    this.webApi.getConclusionTypes(this.usertokenData, this.navParams.get("patientId")).then((result) => {
      if (result['data'] && result['data']) {    
        this.utilities.hideLoading();        
        this.conclusionTypes = result['data']['types'];
        this.conclusionTypeValues = result['data']['values'];     
        this.postedOutcomes = result['data']['outcomes'];            

        this.patientDischarged = result['data']['patient_discharged'];  
        this.patientExpired = result['data']['patient_expired']; 

        console.log(JSON.stringify(this.postedOutcomes, null, "\t"));
      }
    }, (err) => {
      this.utilities.hideLoading();
      if (err.error.data && err.error.data.message) {
        this.utilities.checksessionExpiryError(err.error.data.message);
      }
    });
  }


getComments(){
  this.webApi.getComments(this.usertokenData, this.navParams.get("patientId")).then((result) => {
    if (result['data'] && result['data']) {    
      this.utilities.hideLoading();        
      this.comments = result['data'];
      setTimeout(() => {
        if(this.selectedSectionTab == 'comments'){
          this.goBottomBtnClick();
        }        
      },200);
    }
  }, (err) => {
    this.utilities.hideLoading();
    if (err.error.data && err.error.data.message) {
      this.utilities.checksessionExpiryError(err.error.data.message);
    }
  });
}


postComment(){
  if(!this.commentData.message || this.commentData.message === ""){
      return false;
  }
  this.utilities.showLoading("Please wait...");
  this.commentData.patient_id = this.navParams.get("patientId");
  this.webApi.postComment(this.usertokenData, this.commentData).then((result) => {
    if (result['data'] && result['data']) {          
      this.comments = result['data'];

      // Post Notification once the comment is posted.
      this.webApi.postCommentNotification(this.usertokenData, this.commentData).then((result) => {
        this.commentData.message = null;
      }, (err) => {
        if (err.error.data && err.error.data.message) {
          this.utilities.showAlert("error", err.error.data.message);

        }
      });

      setTimeout(() => {
        this.utilities.hideLoading();
        if(this.selectedSectionTab == 'comments'){
          this.goBottomBtnClick();
        }        
      },200);

    }
  }, (err) => {
    this.utilities.hideLoading();
    if (err.error.data && err.error.data.message) {
      this.utilities.showAlert("error", err.error.data.message);
    }
  });
}


getSinglePatientDetails(patientId){    
  // this.utilities.showLoading("Please wait...")
  this.webApi.getSinglePatient(this.usertokenData, patientId).then((result) => {
    if (result['data'] && result['data']) {    
      this.utilities.hideLoading();        
      this.patient = result['data'];

    }
  }, (err) => {
    this.utilities.hideLoading();
    if (err.error.data && err.error.data.message) {
      this.utilities.checksessionExpiryError(err.error.data.message);
    }
  });
}


  ionViewDidLoad() {
    console.log('ionViewDidLoad PatientAnalysisPage');
  }

  startChat(userId){
    this.utilities.showLoading("Please wait...");
    let usertokenData = {"userId" : this.userData.user_id, "userToken" : this.userData.token};
    this.webApi.createConversation(usertokenData, userId, this.navParams.get("patientId")).then((result) => {
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
