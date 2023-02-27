import { Component } from '@angular/core';
import { NavController, NavParams, ViewController } from 'ionic-angular';
import { UtilitiesProvider } from '../../providers/utilities/utilities';
import { WebApiProvider } from '../../providers/web-api/web-api';

@Component({
  selector: 'page-add-patient-nihss-calculator',
  templateUrl: 'add-patient-nihss-calculator.html',
})
export class AddPatientNihssCalculatorPage {
  total_calculated_points: any = 0;
  selectedNihssData: any = [];
  userData: any = {};
  usertokenData: any = {};

  fromPage: any = null;

  nihss_default_values: any = [
    {
      "label_en": "1A: Level of consciousness",
      "selected_option" : 'consciousness_1',
      "selected_points" : 0,
      "options": [
        {
          "label": "Alert; keenly responsive",
          "points": 0,
          "name" : 'consciousness_1'
        },
        {
          "label": "Arouses to minor stimulation",
          "points": 1,
          "name" : 'consciousness_2'
        },
        {
          "label": "Requires repeated stimulation to arouse",
          "points": 2,
          "name" : 'consciousness_3'
        },
        {
          "label": "Movements to pain",
          "points": 2,
          "name" : 'consciousness_4'
        },
        {
          "label": "Postures or unresponsive",
          "points": 3,
          "name" : 'consciousness_5'
        }
      ],
    },
    {
      "label_en": "1B: Ask month and age",
      "selected_option" : 'month_age_1',
      "selected_points" : 0,
      "options": [
        {
          "label": "Both questions right",
          "points" : 0,
          "name" : 'month_age_1'
        },
        {
          "label": "1 question right",
          "points" : 1,
          "name" : 'month_age_2'
        },
        {
          "label": "0 questions right ",
          "points" : 2,
          "name" : 'month_age_3'
        },
        {
          "label": "Dysarthric/intubated/trauma/language barrier ",
          "points" : 1,
          "name" : 'month_age_4'
        },
        {
          "label": "Aphasic",
          "points" : 2,
          "name" : 'month_age_5'
        }
      ],
    },
    {
      "label_en": "1C: 'Blink eyes' & 'squeeze hands'",
      "selected_option" : 'blink_squeeze_1',
      "selected_points" : 0,
      "options": [
        {
          "label": "Performs both tasks",
          "points" : 0,
          "name" : 'blink_squeeze_1'
        },
        {
          "label": "Performs 1 task",
          "points" : 1,
          "name" : 'blink_squeeze_2'
        },
        {
          "label": "Performs 0 tasks",
          "points" : 2,
          "name" : 'blink_squeeze_3'
        }
      ],
    },
    {
      "label_en": "2: Horizontal extraocular movements",
      "selected_option" : 'horizontal_movements_1',
      "selected_points" : 0,
      "options": [
        {
          "label": "Normal",
          "points" : 0,
          "name" : 'horizontal_movements_1'
        },
        {
          "label": "Partial gaze palsy: can be overcome",
          "points" : 1,
          "name" : 'horizontal_movements_2'
        },
        {
          "label": "Partial gaze palsy: corrects with oculocephalic reflex",
          "points" : 1,
          "name" : 'horizontal_movements_3'
        },
        {
          "label": "Forced gaze palsy: cannot be overcome",
          "points" : 2,
          "name" : 'horizontal_movements_4'
        }
      ],
    },
    {
      "label_en": "3: Visual fields",
      "selected_option" : 'visual_fields_1',
      "selected_points" : 0,
      "options": [
        {
          "label": "No visual loss",
          "points" : 0,
          "name" : 'visual_fields_1'
        },
        {
          "label": "Partial hemianopia",
          "points" : 1,
          "name" : 'visual_fields_2'
        },
        {
          "label": "Complete hemianopia",
          "points" : 2,
          "name" : 'visual_fields_3'
        },
        {
          "label": "Patient is bilaterally blind",
          "points" : 3,
          "name" : 'visual_fields_4'
        },
        {
          "label": "Bilateral hemianopia",
          "points" : 3,
          "name" : 'visual_fields_5'
        }
      ],
    },
    {
      "label_en": "4: Facial palsy",
      "selected_option" : 'facial_palsy_1',
      "selected_points" : 0,
      "options": [
        {
          "label": "Normal symmetry",
          "points" : 0,
          "name" : 'facial_palsy_1'
        },
        {
          "label": "Minor paralysis (flat nasolabial fold, smile asymmetry)",
          "points" : 1,
          "name" : 'facial_palsy_2'
        },
        {
          "label": "Partial paralysis (lower face)",
          "points" : 2,
          "name" : 'facial_palsy_3'
        },
        {
          "label": "Unilateral complete paralysis (upper/lower face)",
          "points" : 3,
          "name" : 'facial_palsy_4'
        },
        {
          "label": "Bilateral complete paralysis (upper/lower face)",
          "points" : 3,
          "name" : 'facial_palsy_5'
        }
      ],
    },
    {
      "label_en": "5A: Left arm motor drift",
      "selected_option" : 'left_arm_drift_1',
      "selected_points" : 0,
      "options": [
        {
          "label": "No drift for 10 seconds",
          "points" : 0,
          "name" : 'left_arm_drift_1'
        },
        {
          "label": "Drift, but doesn't hit bed",
          "points" : 1,
          "name" : 'left_arm_drift_2'
        },
        {
          "label": "Drift, hits bed",
          "points" : 2,
          "name" : 'left_arm_drift_3'
        },
        {
          "label": "Some effort against gravity",
          "points" : 2,
          "name" : 'left_arm_drift_4'
        },
        {
          "label": "No effort against gravity",
          "points" : 3,
          "name" : 'left_arm_drift_5'
        },
        {
          "label": "No movement",
          "points" : 4,
          "name" : 'left_arm_drift_6'
        },
        {
          "label": "Amputation/joint fusion",
          "points" : 0,
          "name" : 'left_arm_drift_7'
        }
      ],
    },
    {
      "label_en": "5B: Right arm motor drift",
      "selected_option" : 'right_arm_drift_1',
      "selected_points" : 0,
      "options": [
        {
          "label": "No drift for 10 seconds",
          "points" : 0,
          "name" : 'right_arm_drift_1'
        },
        {
          "label": "Drift, but doesn't hit bed",
          "points" : 1,
          "name" : 'right_arm_drift_2'
        },
        {
          "label": "Drift, hits bed",
          "points" : 2,
          "name" : 'right_arm_drift_3'
        },
        {
          "label": "Some effort against gravity",
          "points" : 2,
          "name" : 'right_arm_drift_4'
        },
        {
          "label": "No effort against gravity",
          "points" : 3,
          "name" : 'right_arm_drift_5'
        },
        {
          "label": "No movement",
          "points" : 4,
          "name" : 'right_arm_drift_6'
        },
        {
          "label": "Amputation/joint fusion",
          "points" : 0,
          "name" : 'right_arm_drift_7'
        }
      ],
    },
    {
      "label_en": "6A: Left leg motor drift",
      "selected_option" : 'left_leg_drift_1',
      "selected_points" : 0,
      "options": [
        {
          "label": "No drift for 5 seconds",
          "points" : 0,
          "name" : 'left_leg_drift_1'
        },
        {
          "label": "Drift, but doesn't hit bed",
          "points" : 1,
          "name" : 'left_leg_drift_2'
        },
        {
          "label": "Drift, hits bed",
          "points" : 2,
          "name" : 'left_leg_drift_3'
        },
        {
          "label": "Some effort against gravity",
          "points" : 2,
          "name" : 'left_leg_drift_4'
        },
        {
          "label": "No effort against gravity",
          "points" : 3,
          "name" : 'left_leg_drift_5'
        },
        {
          "label": "No movement",
          "points" : 4,
          "name" : 'left_leg_drift_6'
        },
        {
          "label": "Amputation/joint fusion",
          "points" : 0,
          "name" : 'left_leg_drift_7'
        }
      ],
    },
    {
      "label_en": "6B: Right leg motor drift",
      "selected_option" : 'right_leg_drift_1',
      "selected_points" : 0,
      "options": [
        {
          "label": "No drift for 5 seconds",
          "points" : 0,
          "name" : 'right_leg_drift_1'
        },
        {
          "label": "Drift, but doesn't hit bed",
          "points" : 1,
          "name" : 'right_leg_drift_2'
        },
        {
          "label": "Drift, hits bed",
          "points" : 2,
          "name" : 'right_leg_drift_3'
        },
        {
          "label": "Some effort against gravity",
          "points" : 2,
          "name" : 'right_leg_drift_4'
        },
        {
          "label": "No effort against gravity",
          "points" : 3,
          "name" : 'right_leg_drift_5'
        },
        {
          "label": "No movement",
          "points" : 4,
          "name" : 'right_leg_drift_6'
        },
        {
          "label": "Amputation/joint fusion",
          "points" : 0,
          "name" : 'right_leg_drift_7'
        }
      ],
    },
    {
      "label_en": "7: Limb Ataxia",
      "selected_option" : 'limb_ataxia_1',
      "selected_points" : 0,
      "options": [
        {
          "label": "No ataxia",
          "points" : 0,
          "name" : 'limb_ataxia_1'
        },
        {
          "label": "Ataxia in 1 Limb",
          "points" : 1,
          "name" : 'limb_ataxia_2'
        },
        {
          "label": "Ataxia in 2 Limbs",
          "points" : 2,
          "name" : 'limb_ataxia_3'
        },
        {
          "label": "Does not understand",
          "points" : 0,
          "name" : 'limb_ataxia_4'
        },
        {
          "label": "Paralyzed",
          "points" : 0,
          "name" : 'limb_ataxia_5'
        },
        {
          "label": "Amputation/joint fusion",
          "points" : 0,
          "name" : 'limb_ataxia_6'
        }
      ],
    },
    {
      "label_en": "8: Sensation",
      "selected_option" : 'sensation_1',
      "selected_points" : 0,
      "options": [
        {
          "label": "Normal; no sensory loss",
          "points" : 0,
          "name" : 'sensation_1'
        },
        {
          "label": "Mild-moderate loss: less sharp/more dull ",
          "points" : 1,
          "name" : 'sensation_2'
        },
        {
          "label": "Mild-moderate loss: can sense being touched ",
          "points" : 1,
          "name" : 'sensation_3'
        },
        {
          "label": "Complete loss: cannot sense being touched at all",
          "points" : 2,
          "name" : 'sensation_4'
        },
        {
          "label": "No response and quadriplegic ",
          "points" : 2,
          "name" : 'sensation_5'
        },
        {
          "label": "Coma/unresponsive",
          "points" : 2,
          "name" : 'sensation_6'
        }
      ],
    },
    {
      "label_en": "9: Language/aphasia",
      "selected_option" : 'language_1',
      "selected_points" : 0,
      "options": [
        {
          "label": "Normal; no aphasia",
          "points" : 0,
          "name" : 'language_1'
        },
        {
          "label": "Mild-moderate aphasia: some obvious changes, without significant limitation",
          "points" : 1,
          "name" : 'language_2'
        },
        {
          "label": "Severe aphasia: fragmentary expression, inference needed, cannot identify materials",
          "points" : 2,
          "name" : 'language_3'
        },
        {
          "label": "Mute/global aphasia: no usable speech/auditory comprehension",
          "points" : 3,
          "name" : 'language_4'
        },
        {
          "label": "Coma/unresponsive",
          "points" : 3,
          "name" : 'language_5'
        }
      ],
    },
    {
      "label_en": "10: Dysarthria",
      "selected_option" : 'dysarthria_1',
      "selected_points" : 0,
      "options": [
        {
          "label": "Normal",
          "points" : 0,
          "name" : 'dysarthria_1'
        },
        {
          "label": "Mild-moderate dysarthria: slurring but can be understood",
          "points" : 1,
          "name" : 'dysarthria_2'
        },
        {
          "label": "Severe dysarthria: unintelligible slurring or out of proportion to dysphasia",
          "points" : 2,
          "name" : 'dysarthria_3'
        },
        {
          "label": "Mute/anarthric",
          "points" : 2,
          "name" : 'dysarthria_4'
        },
        {
          "label": "Intubated/unable to test",
          "points" : 0,
          "name" : 'dysarthria_5'
        }
      ],
    },
    {
      "label_en": "11: Extinction/inattention",
      "selected_option" : 'extinction_1',
      "selected_points" : 0,
      "options": [
        {
          "label": "No abnormality",
          "points" : 0,
          "name" : 'extinction_1'
        },
        {
          "label": "Visual/tactile/auditory/spatial/personal inattention",
          "points" : 1,
          "name" : 'extinction_2'
        },
        {
          "label": "Extinction to bilateral simultaneous stimulation",
          "points" : 1,
          "name" : 'extinction_3'
        },
        {
          "label": "Profound hemi-inattention (ex: does not recognize own hand)",
          "points" : 2,
          "name" : 'extinction_4'
        },
        {
          "label": "Extinction to >1 modality",
          "points" : 2,
          "name" : 'extinction_5'
        }
      ]
    }
  ];

  constructor(public navCtrl: NavController, public navParams: NavParams, public utilities: UtilitiesProvider, public webApi: WebApiProvider, private viewCtrl: ViewController) {
    this.userData = this.utilities.getLocalObject("userData");
    this.usertokenData = {
      "userId": this.userData.user_id,
      "userToken": this.userData.token
    };
  }

  closeCalculator(){
   this.saveNIHSSScore();
  }

  ionViewWillEnter(){
    this.selectedNihssData = this.navParams.get('nihssData');  
    this.fromPage = this.navParams.get('fromPage');

    if(this.selectedNihssData != null){
      for(let i=0; i <= this.selectedNihssData.length - 1; i++){
        this.nihss_default_values[i]['selected_option'] = this.selectedNihssData[i]['selected_option'];
        this.nihss_default_values[i]['selected_points'] = this.selectedNihssData[i]['selected_points'];
      }
    }

    for(let i=0; i <= this.nihss_default_values.length - 1; i++){
        this.total_calculated_points = this.total_calculated_points +  this.nihss_default_values[i]['selected_points'];
    }
  }

  selectNIHSSOption(type, selected_option, selected_points){
    this.nihss_default_values[type]['selected_option'] = selected_option;
    this.nihss_default_values[type]['selected_points'] = selected_points;
    this.total_calculated_points = 0;
    for(let i=0; i <= this.nihss_default_values.length; i++){
      if(this.nihss_default_values && this.nihss_default_values[i] && this.nihss_default_values[i]['selected_points']){
        this.total_calculated_points = this.total_calculated_points +  this.nihss_default_values[i]['selected_points'];
      }
    }
  }
  
  saveNIHSSScore(){
    this.selectedNihssData = [];
      for(let i=0; i <= this.nihss_default_values.length - 1; i++){
        let options = {
          'selected_option' : this.nihss_default_values[i]['selected_option'],
          'selected_points' : this.nihss_default_values[i]['selected_points']
        };
        this.selectedNihssData.push(options);        
      }
      let modalData = {
        'points' : this.total_calculated_points,
        'nihssData' : this.selectedNihssData 
      }
      this.viewCtrl.dismiss(modalData);
  }


  ionViewDidLoad() {
    console.log('ionViewDidLoad PatientNihssCalculatorPage');
  }

}
