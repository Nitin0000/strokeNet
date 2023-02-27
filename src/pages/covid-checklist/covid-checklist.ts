import { Component } from '@angular/core';
import { NavController, NavParams, ViewController } from 'ionic-angular';
import { UtilitiesProvider } from '../../providers/utilities/utilities';
import { WebApiProvider } from '../../providers/web-api/web-api';



@Component({
  selector: 'page-covid-checklist',
  templateUrl: 'covid-checklist.html',
})
export class CovidChecklistPage {
  total_calculated_points: any = 0;
  selectedCOVIDData: any = [];

  userData: any = {};
  usertokenData: any = {};

  covid_checklist: any = [
    {
      "label_en": "Are you experiencing any of the following symptoms?",
      "selected_points" : 0,      
      "options": [
        {
          "label": "Cough",
          "points": 1,
          "name" : 'symptoms_1',
          "checked": false,
        },
        {
          "label": "Fever",
          "points": 1,
          "name" : 'symptoms_2',
          "checked": false,
        },
        {
          "label": "Difficulty in breathing",
          "points": 1,
          "name" : 'symptoms_3',
          "checked": false,
        },
        {
          "label": "Loss of senses of smell and taste",
          "points": 1,
          "name" : 'symptoms_4',
          "checked": false,
        },
        {
          "label": "None of the above",
          "points": 0,
          "name" : 'symptoms_5',
          "checked": false,
        }
      ],
    },
    {
      "label_en": "Have you ever had any of the following?",
      "selected_points" : 0,
      "options": [
        {
          "label": "Diabetes",
          "points": 1,
          "name" : 'diseases_1',
          "checked": false,
        },
        {
          "label": "Hypertension",
          "points": 1,
          "name" : 'diseases_2',
          "checked": false,
        },
        {
          "label": "Lung disease",
          "points": 1,
          "name" : 'diseases_3',
          "checked": false,
        },
        {
          "label": "Heart disease",
          "points": 1,
          "name" : 'diseases_4',
          "checked": false,
        },
        {
          "label": "Kidney Disorder",
          "points": 1,
          "name" : 'diseases_5',
          "checked": false,
        },
        {
          "label": "None of the above",
          "points": 0,
          "name" : 'diseases_6',
          "checked": false,
        }
      ],
    },
    {
      "label_en": "Have you ever travelled anywhere internationally in the last 45 days?",
      "selected_points" : 0,
      "options": [
        {
          "label": "Yes",
          "points": 1,
          "name" : 'travel_1',
          "checked": false,
        },
        {
          "label": "No",
          "points": 0,
          "name" : 'travel_2',
          "checked": false,
        }
      ],
    },
    {
      "label_en": "Are you from containment zone?",
      "selected_points" : 0,
      "options": [
        {
          "label": "Yes",
          "points": 1,
          "name" : 'containment_1',
          "checked": false,
        },
        {
          "label": "No",
          "points": 0,
          "name" : 'containment_2',
          "checked": false,
        }
      ],
    },
    {
      "label_en": "Which of the following apply to you?",
      "selected_points" : 0,
      "options": [
        {
          "label": "I have recently interacted or lived with someone who has tested positive for COVID-19",
          "points": 1,
          "name" : 'contact_1',
          "checked": false,
        },
        {
          "label": "I am a healthcare worker and examined a COVID-19 confirmed case without protective gear",
          "points": 1,
          "name" : 'contact_2',
          "checked": false,
        },
        {
          "label": "None of the above",
          "points": 0,
          "name" : 'contact_3',
          "checked": false,
        }
      ],
    }

  ];


  constructor(public navCtrl: NavController, public navParams: NavParams, public utilities: UtilitiesProvider, public webApi: WebApiProvider, private viewCtrl: ViewController) {
    this.userData = this.utilities.getLocalObject("userData");
    this.usertokenData = {
      "userId": this.userData.user_id,
      "userToken": this.userData.token
    };
  }

  ionViewWillEnter(){
    if(this.navParams.get('covidData')){
      this.selectedCOVIDData = this.navParams.get('covidData');    
      this.covid_checklist = this.selectedCOVIDData;
      this.calculatePoints();
    } 
  }

  selectCOVIDOption(type, option, selected_option, selected_points){   
    if(selected_points > 0){
      Object.keys(this.covid_checklist[type]['options']).forEach(key => {
        if(this.covid_checklist[type]['options'][key]['points'] === 0){
          this.covid_checklist[type]['options'][key]['checked'] = false;
        }
      });
      if( this.covid_checklist[type]['options'][option]['checked']){
        this.covid_checklist[type]['options'][option]['checked'] = false;
      }else{
        this.covid_checklist[type]['options'][option]['checked'] = true;
      }
    }else{
      Object.keys(this.covid_checklist[type]['options']).forEach(key => {
        this.covid_checklist[type]['options'][key]['checked'] = false;
      });
      if(this.covid_checklist[type]['options'][option]['checked']){
        this.covid_checklist[type]['options'][option]['checked'] = false;
      }else{
        this.covid_checklist[type]['options'][option]['checked'] = true;
      }
    }
    this.selectedCOVIDData = this.covid_checklist;
    this.calculatePoints();
  }

  calculatePoints(){
    this.total_calculated_points = 0;
    for(let i=0; i <= this.covid_checklist.length - 1; i++){
      for(let z=0; z <= this.covid_checklist[i]['options'].length - 1; z++){
        if(this.covid_checklist[i]['options'][z]['checked']){
          this.total_calculated_points = this.total_calculated_points +  this.covid_checklist[i]['options'][z]['points'];
        }
      }
    }
  }

  saveCOVIDScore(){
    let submitCOVIDData = {
      'covid_score' : this.total_calculated_points,
      'covid_values' : this.selectedCOVIDData,
    }
    this.viewCtrl.dismiss({'covidData' : submitCOVIDData});
  } 
}
