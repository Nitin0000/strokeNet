import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { MyApp } from './app.component';

import {IonAffixModule} from 'ion-affix';

//Modules
import { HttpModule } from '@angular/http';
import { HttpClientModule } from '@angular/common/http';
import { IonicImageViewerModule } from 'ionic-img-viewer';
import { LongPressModule } from 'ionic-long-press';

import { PatientsListPage } from '../pages/patients-list/patients-list';
import { AddPatientPage } from '../pages/add-patient/add-patient';
import { AccountPage } from '../pages/account/account';
import { PatientSummaryPage } from '../pages/patient-summary/patient-summary';
import { PatientScanFilesPage } from '../pages/patient-scan-files/patient-scan-files';
import { PatientNihssCalculatorPage } from '../pages/patient-nihss-calculator/patient-nihss-calculator';
import { AddPatientNihssCalculatorPage } from '../pages/add-patient-nihss-calculator/add-patient-nihss-calculator';

import { PatientNihssPage } from '../pages/patient-nihss/patient-nihss';
import { PatientPresentationPage } from '../pages/patient-presentation/patient-presentation';
import { PatientBasicDetailsPage } from '../pages/patient-basic-details/patient-basic-details';
import { EditProfilePage } from '../pages/edit-profile/edit-profile';
import { LoginPage } from '../pages/login/login';
import { PatientDetailPage } from '../pages/patient-detail/patient-detail';
import { ContactUsPage } from '../pages/contact-us/contact-us';
import { ChangePasswordPage } from '../pages/change-password/change-password';
import { QrcodePage } from '../pages/qrcode/qrcode';
import { PatientMrsPage } from '../pages/patient-mrs/patient-mrs';
import { PatientAnalysisPage } from '../pages/patient-analysis/patient-analysis';
import { NoInternetPage } from '../pages/no-internet/no-internet';
import { ChatPage } from '../pages/chat/chat';
import { ConversationsPage } from '../pages/conversations/conversations';
import { OnlineTeamPage } from '../pages/online-team/online-team';
import { ImageSliderPage } from '../pages/image-slider/image-slider';
import { PatientComplicationsPage } from '../pages/patient-complications/patient-complications';
import { PatientScanTimesModalPage } from '../pages/patient-scan-times-modal/patient-scan-times-modal';
import { CovidChecklistPage } from '../pages/covid-checklist/covid-checklist';
import { PatientIvtMedicationPage } from '../pages/patient-ivt-medication/patient-ivt-medication';
import { QualityMatrixPage } from '../pages/quality-matrix/quality-matrix';

//Components
import { NoDataComponent } from '../components/no-data/no-data';
import { QRCodeModule } from 'angular2-qrcode';

//Providers
import { Config } from './app.config';
import { AuthServiceProvider } from '../providers/auth-service/auth-service';
import { UtilitiesProvider } from '../providers/utilities/utilities';
import { WebApiProvider } from '../providers/web-api/web-api';

//Plugins
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { Keyboard } from '@ionic-native/keyboard';
import { Device } from '@ionic-native/device';
import { File } from '@ionic-native/file';
import { FileTransfer, FileTransferObject } from '@ionic-native/file-transfer';
import { Camera } from '@ionic-native/camera';
import { AppVersion } from '@ionic-native/app-version';
import { Network } from '@ionic-native/network';
import { InAppBrowser } from '@ionic-native/in-app-browser';
import { Deeplinks } from '@ionic-native/deeplinks';
import { ImagePicker } from '@ionic-native/image-picker';
import { DatePipe } from '@angular/common';
import { MomentModule } from 'angular2-moment';
import { PhotoViewer } from '@ionic-native/photo-viewer';
import { CapitalizeFirstPipe } from '../pipes/capitalizefirst/capitalizefirst';
import { OneSignal } from '@ionic-native/onesignal';
import { MediaCapture } from '@ionic-native/media-capture';
import { StreamingMedia } from '@ionic-native/streaming-media';
import { AndroidPermissions } from '@ionic-native/android-permissions';
import { DashboardPage } from '../pages/dashboard/dashboard';
import { ContentPage } from '../pages/content/content';
import { BarcodeScanner } from '@ionic-native/barcode-scanner';
import { CallNumber } from '@ionic-native/call-number';

import { AngularFireModule } from 'angularfire2';
import { AngularFireDatabaseModule} from 'angularfire2/database';
import { ZoomPanDirective } from '../pipes/zoompan';
import { PatientContradictionsPage } from '../pages/patient-contradictions/patient-contradictions';
import { DoubletapDirective } from '../directives/double-tap';

import { IonicCacheSrcModule } from 'ionic-cache-src';
import { IonicStorageModule } from '@ionic/storage';

// import { VideoPlayer } from '@ionic-native/video-player';

import { PhotoLibrary } from '@ionic-native/photo-library';
import { SocialSharing } from '@ionic-native/social-sharing';
import { NearestSpokesPage } from '../pages/nearest-spokes/nearest-spokes';

// import { Zoom } from '@ionic-native/zoom/ngx';

export var firebaseConfig = {
  apiKey: "AIzaSyDbw9Z5PxsvAqrbS1eYr7mdGrjDkRWEZN0",
  authDomain: "strokenetchandigarh.firebaseapp.com",
  databaseURL: "https://strokenetchandigarh.firebaseio.com",
  projectId: "strokenetchandigarh",
  storageBucket: "strokenetchandigarh.appspot.com",
  messagingSenderId: "453619438985",
  appId: "1:453619438985:web:3ec6be7ba4ed366475bd58"
};

@NgModule({
  declarations: [
    MyApp,
    PatientsListPage,
    AccountPage,
    AddPatientPage,
    PatientSummaryPage,
    PatientScanFilesPage,
    PatientNihssCalculatorPage,
    PatientNihssPage,
    PatientPresentationPage,
    PatientBasicDetailsPage,
    EditProfilePage,
    OnlineTeamPage,
    LoginPage,
    PatientDetailPage,
    DashboardPage,
    PatientMrsPage,
    ContactUsPage,
    ChangePasswordPage,
    AddPatientNihssCalculatorPage,
    ContentPage,
    QrcodePage,
    PatientAnalysisPage,
    NoInternetPage,
    ChatPage,
    ConversationsPage,
    ImageSliderPage,
    PatientComplicationsPage,
    PatientScanTimesModalPage,
    CovidChecklistPage,
    PatientIvtMedicationPage,
    NoDataComponent,
    CapitalizeFirstPipe,
    PatientContradictionsPage,
    NearestSpokesPage,
    QualityMatrixPage,
    ZoomPanDirective,
    DoubletapDirective,
  ],
  imports: [
    BrowserModule,
    HttpModule,
    QRCodeModule,
    HttpClientModule,
    IonicImageViewerModule,
    LongPressModule,
    MomentModule,    
    IonAffixModule,
    IonicModule.forRoot(MyApp, {
      platforms: {
        ios: {
          backButtonText: '',
          tabsHideOnSubPages: true,
          swipeBackEnabled: false,
          statusbarPadding: true,
          scrollAssist: true,
          autoFocusAssist: false
        },
        android: {
          backButtonText: '',
          tabsHideOnSubPages: true,
          swipeBackEnabled: false,
          scrollAssist: true,
          autoFocusAssist: false
        }
      }
    }),
    IonicStorageModule.forRoot(),
    IonicCacheSrcModule,
    AngularFireModule.initializeApp(firebaseConfig),
    AngularFireDatabaseModule,
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    PatientsListPage,
    AccountPage,
    AddPatientPage,
    PatientSummaryPage,
    PatientScanFilesPage,
    PatientNihssCalculatorPage,
    PatientNihssPage,
    PatientPresentationPage,
    PatientBasicDetailsPage,
    EditProfilePage,
    DashboardPage,
    PatientMrsPage,
    QrcodePage,
    LoginPage,
    PatientDetailPage,
    ContactUsPage,
    ChangePasswordPage,
    AddPatientNihssCalculatorPage,
    ContentPage,
    PatientAnalysisPage,
    OnlineTeamPage,
    NoInternetPage,
    ChatPage,
    ConversationsPage,
    PatientComplicationsPage,
    PatientScanTimesModalPage,
    CovidChecklistPage,
    PatientIvtMedicationPage,
    ImageSliderPage,
    NoDataComponent,
    PatientContradictionsPage,
    NearestSpokesPage,
    QualityMatrixPage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    Keyboard,
    InAppBrowser,
    Device,
    Network,
    FileTransfer,
    FileTransferObject,
    File,
    Config,
    Camera,
    AppVersion,
    DatePipe,
    AuthServiceProvider,
    UtilitiesProvider,
    WebApiProvider,
    Deeplinks,
    CallNumber,
    ImagePicker,
    PhotoViewer,
    OneSignal,
    MediaCapture,
    StreamingMedia,
    AndroidPermissions,
    BarcodeScanner,
    CallNumber,
    // VideoPlayer,
    PhotoLibrary,
    SocialSharing, 
    // Zoom,   
    { provide: ErrorHandler, useClass: IonicErrorHandler }
  ]
})
export class AppModule { }
