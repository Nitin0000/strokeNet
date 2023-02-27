import { Component, ViewChild } from '@angular/core';
import { Nav, Platform, Events, MenuController, ToastController} from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { OneSignal } from '@ionic-native/onesignal';
import { Deeplinks } from '@ionic-native/deeplinks';
import { Keyboard } from '@ionic-native/keyboard';

import { PatientsListPage } from '../pages/patients-list/patients-list';
import { EditProfilePage } from '../pages/edit-profile/edit-profile';
import { LoginPage } from '../pages/login/login';

import { UtilitiesProvider } from '../providers/utilities/utilities';
import { AuthServiceProvider } from '../providers/auth-service/auth-service';
import { ContactUsPage } from '../pages/contact-us/contact-us';
import { AndroidPermissions } from '@ionic-native/android-permissions';
import { DashboardPage } from '../pages/dashboard/dashboard';
import { ChangePasswordPage } from '../pages/change-password/change-password';
import { PatientDetailPage } from '../pages/patient-detail/patient-detail';
import { PatientSummaryPage } from '../pages/patient-summary/patient-summary';
import { PatientAnalysisPage } from '../pages/patient-analysis/patient-analysis';

import { WebApiProvider } from '../providers/web-api/web-api';

import { Network } from '@ionic-native/network';
import { NoInternetPage } from '../pages/no-internet/no-internet';
import { ConversationsPage } from '../pages/conversations/conversations';
import { ChatPage } from '../pages/chat/chat';

@Component({
  templateUrl: 'app.html'
})

export class MyApp {
  @ViewChild(Nav) nav: Nav;
  userData: any = {};
  rootPage: any;

  pages: Array<{ title: string, component: any, icon: any}>;

  constructor(public platform: Platform, public statusBar: StatusBar, public splashScreen: SplashScreen, public authService: AuthServiceProvider, public events: Events, public utilities: UtilitiesProvider, public menuCtrl: MenuController, private oneSignal: OneSignal, private deeplinks: Deeplinks, private keyboard: Keyboard, private androidPermissions: AndroidPermissions, private network: Network, public toast: ToastController, public webApi: WebApiProvider) {
    this.initializeApp();

    // Check if the user is already loggedin
    // this.checkIfLoggedin();
    this.events.subscribe('check:LoggedIn', () => {
      this.checkIfLoggedin();
    });

    this.events.subscribe('sessionExpired:logOut', () => {
      this.clearSessionAndLogOut();
    });
    
    // this.keyboard.hideFormAccessoryBar(true);
    this.keyboard.hideFormAccessoryBar(false);

    // used for an example of ngFor and navigation
    this.pages = [
      { title: 'Dashboard', component: DashboardPage, icon: 'md-home'},
      { title: 'Edit Profile', component: EditProfilePage, icon: 'md-create'},
      { title: 'Change Password', component: ChangePasswordPage, icon: 'md-unlock'},
      { title: 'Contact Us', component: ContactUsPage, icon: 'md-mail' },
      { title: 'Conversations', component: ConversationsPage, icon: 'md-chatboxes' },
    ];
  }

  initializeApp() {
    this.platform.ready().then(() => {
      this.statusBar.styleDefault();
      this.splashScreen.hide();

      this.deeplinks.routeWithNavController(this.nav, {
        '/patients_list': PatientsListPage,
        '/patient_detail/:patientId' : PatientDetailPage,
        '/patient_summary/:patientId' : PatientSummaryPage,
        '/patient_analysis/:patientId' : PatientAnalysisPage,
        '/patient_analysis/:patientId/:gotoTab' : PatientAnalysisPage,
        '/chat/:chatId': ChatPage        
      }).subscribe((match) => {
        console.log('Successfully matched route', match);
        console.log(JSON.stringify(match, null, "\t"));
      }, (noMatch) => {
        console.error('Got a deeplink that didn\'t match', noMatch);
      });

      setTimeout(() => {
          if(this.network.type !== "none"){
            this.checkIfLoggedin();   
          }else{
            this.rootPage = NoInternetPage;
          }
      },250);

    let disconnectSubscription = this.network.onDisconnect().subscribe(() => {
        console.log('network disconnected!');
        // let toast = this.toast.create({
        //   message: 'You are now disconnected from internet!',
        //   position: 'top',
        //   duration: 3000,
        // });
        // toast.present();
        setTimeout(() => {
          this.rootPage = NoInternetPage;
        },200);
    });
    
    // watch network for a connection
    let connectSubscription = this.network.onConnect().subscribe(() => {
      console.log('network connected!');
      // let toast = this.toast.create({
      //   message: 'You are now connected to internet!',
      //   position: 'top',
      //   duration: 3000,
      // });
      // toast.present();

      setTimeout(() => {
        this.checkIfLoggedin();   
      },200);
      
    });

      

      if (this.platform.is('android')) {
        this.androidPermissions.checkPermission(this.androidPermissions.PERMISSION.WRITE_EXTERNAL_STORAGE).then(
          result => {

          },
          err => this.androidPermissions.requestPermissions([this.androidPermissions.PERMISSION.WRITE_EXTERNAL_STORAGE, this.androidPermissions.PERMISSION.READ_EXTERNAL_STORAGE, this.androidPermissions.PERMISSION.RECORD_AUDIO,
          this.androidPermissions.PERMISSION.RECORD_VIDEO
          ])
        );
      }


      this.oneSignal.startInit('5365fee5-1919-4bd4-a358-269cc4fb1925', '453619438985');
      this.oneSignal.inFocusDisplaying(this.oneSignal.OSInFocusDisplayOption.Notification);
      this.oneSignal.handleNotificationReceived().subscribe(() => {
        // do something when notification is received
      });
      this.oneSignal.handleNotificationOpened().subscribe((jsonData) => {
      });
      this.oneSignal.getIds().then(ids => {
        this.utilities.setLocalItem("OneSignaluserId", ids.userId);
        this.utilities.setLocalItem("OneSignalpushToken", ids.pushToken);
      });
      this.oneSignal.endInit();

      // this.checkIfLoggedin();
    });
  }

  // Clear Session and Logout()
  clearSessionAndLogOut(){
      this.utilities.showLoading("Session Expired. Logging out..."); // Show Loader
      this.menuCtrl.swipeEnable(false);
      this.utilities.clearLocalStorage();
      setTimeout(() => {
        this.utilities.hideLoading();
        this.nav.setRoot(LoginPage, {}, { animate: false });
        window.location.reload();
      }, 1000);
      return false;
  }

  logOut() {
    this.menuCtrl.toggle();
    this.menuCtrl.swipeEnable(false);
    this.utilities.showLoading("Logging out..."); // Show Loader
    setTimeout(() => {
      this.utilities.clearLocalStorage();
      setTimeout(() => {
        this.utilities.hideLoading();
        this.nav.setRoot(LoginPage, {}, { animate: false });
        window.location.reload();
      }, 1000);
    }, 1500);
  }

  checkIfLoggedin() {
    var checkUserLogin = this.utilities.getLocalObject("userData");
    if (Object.keys(checkUserLogin).length === 0) {
      this.rootPage = LoginPage;
    } else {      
      this.userData = checkUserLogin;      

      this.rootPage = DashboardPage;

      this.authService.checkUserSession({ "userId": this.userData.user_id, "userToken": this.userData.token}).then((result) => {
        // console.log(JSON.stringify(result, null, "\t"));
      }, (err) => {
        // console.log(JSON.stringify(err, null, "\t"));
          if(err.error){                   
              if(!err.error.data){
                this.clearSessionAndLogOut();
              }
          }
      });
            
    }
  }

  openPage(page) {
    this.nav.setRoot(page.component);
  }
}
