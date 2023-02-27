import { Component } from '@angular/core';
import { NavController, NavParams, ViewController } from 'ionic-angular';
import { UtilitiesProvider } from '../../providers/utilities/utilities';
import { WebApiProvider } from '../../providers/web-api/web-api';



@Component({
  selector: 'page-patient-contradictions',
  templateUrl: 'patient-contradictions.html',
})
export class PatientContradictionsPage {
  selectedContradictionsData: any = new Array();
  total_absolute_points: number = 0;
  total_relative_points: number = 0;
  ivt_ineligible: boolean = false;
  ivt_eligible: boolean = false;
   

  userData: any = {};
  usertokenData: any = {};

  patientId: any = null;

  contradictions: any = [
    {
      "label_en": "Absolute Contraindications",
      "contraction_type" : "absolute_contradictions",
      "selected_points" : 0,      
      "options": [
        {
          "label": "Did not consent",
          "points": 1,
          "name" : 'absolute_contradictions_1',
          "checked": false,
        },
        {
          "label": "Head trauma X 3 months",
          "points": 1,
          "name" : 'absolute_contradictions_2',
          "checked": false,
        },
        {
          "label": "Prior stroke X 3 months",
          "points": 1,
          "name" : 'absolute_contradictions_3',
          "checked": false,
        },
        {
          "label": "Symptoms suggesting SAH",
          "points": 1,
          "name" : 'absolute_contradictions_4',
          "checked": false,
        },
        {
          "label": "Arterial puncture at noncompressible site X 7 days",
          "points": 1,
          "name" : 'absolute_contradictions_5',
          "checked": false,
        },
        {
          "label": "Previous ICH",
          "points": 1,
          "name" : 'absolute_contradictions_6',
          "checked": false,
        },
        {
          "label": "Intracranial neoplasm, AVM, or aneurysm",
          "points": 1,
          "name" : 'absolute_contradictions_7',
          "checked": false,
        },
        {
          "label": "Recent intracranial or intraspinal surgery",
          "points": 1,
          "name" : 'absolute_contradictions_8',
          "checked": false,
        },
        {
          "label": "BP >185mmHg(SP)/>110mmHg(DP)",
          "points": 1,
          "name" : 'absolute_contradictions_9',
          "checked": false,
        },
        {
          "label": "Active internal bleeding",
          "points": 1,
          "name" : 'absolute_contradictions_10',
          "checked": false,
        },
        {
          "label": "Acute bleeding diathesis",
          "points": 1,
          "name" : 'absolute_contradictions_11',
          "checked": false,
        },
        {
          "label": "Heparin X48 hours with raised aPTT",
          "points": 1,
          "name" : 'absolute_contradictions_12',
          "checked": false,
        },
        {
          "label": "Current use of NOACs (with elevated PT, aPTT, TT, ECT)",
          "points": 1,
          "name" : 'absolute_contradictions_13',
          "checked": false,
        },
        {
          "label": "Blood glucose concentration <50mg/dL (2.7 mmol/L)",
          "points": 1,
          "name" : 'absolute_contradictions_14',
          "checked": false,
        }
      ],
    },
    {
      "label_en": "Relative Contraindications",
      "contraction_type" : "relative_contradictions",
      "selected_points" : 0,
      "options": [
        {
          "label": "Minor/rapidly improving symptoms",
          "points": 1,
          "name" : 'relative_contradictions_1',
          "checked": false,
        },
        {
          "label": "Pregnancy",
          "points": 1,
          "name" : 'relative_contradictions_2',
          "checked": false,
        },
        {
          "label": "Seizure at onset with postictal residual neurological impairments",
          "points": 1,
          "name" : 'relative_contradictions_3',
          "checked": false,
        },
        {
          "label": "Major surgery or serious trauma X 14 days",
          "points": 1,
          "name" : 'relative_contradictions_4',
          "checked": false,
        },
        {
          "label": "Recent GI or urinary tract hemorrhage X 21 days",
          "points": 1,
          "name" : 'relative_contradictions_5',
          "checked": false,
        },
        {
          "label": "Recent acute MI X 3 months",
          "points": 1,
          "name" : 'relative_contradictions_6',
          "checked": false,
        }
      ],
    },
  ];

  constructor(public navCtrl: NavController, public navParams: NavParams, public utilities: UtilitiesProvider, public webApi: WebApiProvider, private viewCtrl: ViewController) {
    this.userData = this.utilities.getLocalObject("userData");
    this.usertokenData = {
      "userId": this.userData.user_id,
      "userToken": this.userData.token
    };
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad PatientContradictionsPage');
  }

  ionViewWillEnter(){
    if(this.navParams.get('patientContradictionsData')){
      let contradictionsData = this.navParams.get('patientContradictionsData');
      if(contradictionsData.contradictions_data){
        this.selectedContradictionsData = contradictionsData.contradictions_data.split(",");   
        for(let selection = 0; selection <= this.selectedContradictionsData.length - 1; selection++){
          for(let ai=0; ai <= this.contradictions.length - 1; ai++){
              for(let az=0; az <= this.contradictions[ai]['options'].length - 1; az++){
                if(this.selectedContradictionsData[selection] == this.contradictions[ai]['options'][az]['name']){
                  this.contradictions[ai]['options'][az]['checked'] = true;
                }
              }
          } 
        }
        this.calculatePoints();
      }
    } 
    this.patientId = this.navParams.get("patientId");
  }

  selectContradictionOption(type, option, selected_option, selected_points, contradictType){  
    if(contradictType === "absolute_contradictions"){
       for(let ai=0; ai <= this.contradictions.length - 1; ai++){
            // if(this.contradictions[ai]['contraction_type'] === "relative_contradictions"){
            //   for(let az=0; az <= this.contradictions[ai]['options'].length - 1; az++){
            //     this.contradictions[ai]['options'][az]['checked'] = false;
            //   }
            // }
      }
    }
    if(contradictType === "relative_contradictions"){
      for(let ai=0; ai <= this.contradictions.length - 1; ai++){
        // if(this.contradictions[ai]['contraction_type'] === "absolute_contradictions"){
        //   for(let az=0; az <= this.contradictions[ai]['options'].length - 1; az++){
        //     this.contradictions[ai]['options'][az]['checked'] = false;
        //   }
        // }
      }
    }

    Object.keys(this.contradictions[type]['options']).forEach(key => {
      if(this.contradictions[type]['options'][key]['points'] === 0){
        this.contradictions[type]['options'][key]['checked'] = false;
      }
    });
    if( this.contradictions[type]['options'][option]['checked']){
      this.contradictions[type]['options'][option]['checked'] = false;
    }else{
      this.contradictions[type]['options'][option]['checked'] = true;
    }

    this.selectedContradictionsData = new Array();
    for(let ai=0; ai <= this.contradictions.length - 1; ai++){
        for(let az=0; az <= this.contradictions[ai]['options'].length - 1; az++){
          if(this.contradictions[ai]['options'][az]['checked']){
            this.selectedContradictionsData.push(this.contradictions[ai]['options'][az]['name']);
          }
        }
    } 
    this.calculatePoints();
  }

  calculatePoints(){
    this.total_absolute_points = 0;
    this.total_relative_points = 0;

    for(let i=0; i <= this.contradictions.length - 1; i++){
      for(let z=0; z <= this.contradictions[i]['options'].length - 1; z++){
        if(this.contradictions[i]['options'][z]['checked'] == true && (this.contradictions[i]['contraction_type'] === "absolute_contradictions")){
          this.total_absolute_points = this.total_absolute_points +  this.contradictions[i]['options'][z]['points'];
        }
        
        if(this.contradictions[i]['options'][z]['checked'] == true && (this.contradictions[i]['contraction_type'] === 
        "relative_contradictions")){
          this.total_relative_points = this.total_relative_points +  this.contradictions[i]['options'][z]['points'];
        }
      }
    }
    // Check if IVT InEligible
    if(this.total_absolute_points > 0){
      this.ivt_ineligible = true;
      this.ivt_eligible = false;
    }else{
      this.ivt_ineligible = false;
    }
    // Check if IVT Eligible
    if(this.total_relative_points > 0){
      this.ivt_ineligible = false;
      this.ivt_eligible = true;
    }else{
      this.ivt_eligible = false;
    }
    if(this.total_absolute_points > 0 && this.total_relative_points > 0){
      this.ivt_ineligible = true;
      this.ivt_eligible = false;
    }
  }

  closeModal(){
    this.viewCtrl.dismiss();
  }

  saveContradictionsScore(){    

    let submitContractionsData = {
      'patient_id' : this.patientId,
      'contradictions_data' : this.selectedContradictionsData.join(","),
      'absolute_score' : this.total_absolute_points,
      'relative_score' : this.total_relative_points,
      'ivt_eligible' : 0,
    };


    if(this.ivt_ineligible){
      submitContractionsData.ivt_eligible = 0;
    }
    if(this.ivt_eligible){
      submitContractionsData.ivt_eligible = 1;
    }

    this.utilities.showLoading("Please wait...");
      this.webApi.updatePatientContradictions(this.usertokenData,submitContractionsData).then((result) => {
          this.utilities.hideLoading();    
          if(result['data'] && result['data']['message']){                  
            // this.utilities.showAlert("success", result['data']['message']);
            this.viewCtrl.dismiss({'contradictionsData' : submitContractionsData});
          }
      }, (err) => {
        this.utilities.hideLoading();     
        if(err.error.data && err.error.data.message){                   
            this.utilities.showAlert("error",err.error.data.message);   
        }
    });   

  }

}
