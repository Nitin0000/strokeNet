import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Config } from '../../app/app.config';

import 'rxjs/add/operator/map';

@Injectable()
export class WebApiProvider {

  constructor(public http: HttpClient, private config: Config) {
    console.log('Hello WebApiProvider Provider');
  }

  // Get Pages
  getPages() {
    return new Promise((resolve, reject) => {
      this.http.get(this.config.webApiUrl + "/get_pages")
        .subscribe(data => {
          resolve(data);
        }, (err) => {
          reject(err);
        });
    });
  }

  // get Single page

  getSinglePage(pageId) {
    return new Promise((resolve, reject) => {
      this.http.get(this.config.webApiUrl + "/page/" + pageId)
        .subscribe(data => {
          resolve(data);
        }, (err) => {
          reject(err);
        });
    });
  }

  updateProfile(tokenData, data) {
    return new Promise((resolve, reject) => {
      this.http.post(this.config.webApiUrl + "/auth/edit_profile", data, { headers: tokenData })
        .subscribe(data => {
          resolve(data);
        }, (err) => {
          reject(err);
        });
    });
  }

  updateOnlineStatus(tokenData) {
    return new Promise((resolve, reject) => {
      this.http.post(this.config.webApiUrl + "/auth/update_online_status", {}, { headers: tokenData })
        .subscribe(data => {
          resolve(data);
        }, (err) => {
          reject(err);
        });
    });
  }


  // Get Centers List
  getCenters() {
    return new Promise((resolve, reject) => {
      this.http.get(this.config.webApiUrl + "/get_centers")
        .subscribe(data => {
          resolve(data);
        }, (err) => {
          reject(err);
        });
    });
  }

  // Get Hubs List
  getHubs() {
    return new Promise((resolve, reject) => {
      this.http.get(this.config.webApiUrl + "/get_hubs")
        .subscribe(data => {
          resolve(data);
        }, (err) => {
          reject(err);
        });
    });
  }

  // Get Comorbidities List
  getComorbidities() {
    return new Promise((resolve, reject) => {
      this.http.get(this.config.webApiUrl + "/get_comorbidities")
        .subscribe(data => {
          resolve(data);
        }, (err) => {
          reject(err);
        });
    });
  }

  // Get Global Settings Array
  getGlobalSettings() {
    return new Promise((resolve, reject) => {
      this.http.get(this.config.webApiUrl + "/get_global_settings")
        .subscribe(data => {
          resolve(data);
        }, (err) => {
          reject(err);
        });
    });
  }


  //Photo Gallery
  getPhotoGallery() {
    return new Promise((resolve, reject) => {
      this.http.get(this.config.webApiUrl + "/photo_gallery")
        .subscribe(data => {
          resolve(data);
        }, (err) => {
          reject(err);
        });
    });
  }

  //Send OTP password
  sendOTPCode(data) {
    return new Promise((resolve, reject) => {
      this.http.post(this.config.webApiUrl + "/sms/send_otp", data)
        .subscribe(data => {
          resolve(data);
        }, (err) => {
          reject(err);
        });
    });
  }
  // Verify OTP
  verifyOTP(data) {
    return new Promise((resolve, reject) => {
      this.http.post(this.config.webApiUrl + "/sms/verify_otp", data)
        .subscribe(data => {
          resolve(data);
        }, (err) => {
          reject(err);
        });
    });
  }

  //Contact us
  contactUs(tokenData, data) {
    return new Promise((resolve, reject) => {
      this.http.post(this.config.webApiUrl + "/contact_us", data, { headers: tokenData })
        .subscribe(data => {
          resolve(data);
        }, (err) => {
          reject(err);
        });
    });
  }

  changePassword(tokenData, data) {
    return new Promise((resolve, reject) => {
      this.http.post(this.config.webApiUrl + "/auth/change_password", data, { headers: tokenData })
        .subscribe(data => {
          resolve(data);
        }, (err) => {
          reject(err);
        });
    });
  }


  // Search Patient with code
  findPatientWithPatientCode(tokenData, patientCode) {
    return new Promise((resolve, reject) => {
      this.http.get(this.config.webApiUrl + "/patients/search_patient/" + patientCode, { headers: tokenData })
        .subscribe(data => {
          resolve(data);
        }, (err) => {
          reject(err);
        });
    });
  }

  // Get Patient Details
  getSinglePatient(tokenData, patientId) {
    return new Promise((resolve, reject) => {
      this.http.get(this.config.webApiUrl + "/patients/patient/" + patientId, { headers: tokenData })
        .subscribe(data => {
          resolve(data);
        }, (err) => {
          reject(err);
        });
    });
  }

  // Get User alotted patients
  getUserPatients(tokenData) {
    return new Promise((resolve, reject) => {
      this.http.get(this.config.webApiUrl + "/patients/user_patients", { headers: tokenData })
        .subscribe(data => {
          resolve(data);
        }, (err) => {
          reject(err);
        });
    });
  }


  // Add a new Patient
  addPatient(tokenData, data) {
    return new Promise((resolve, reject) => {
      this.http.post(this.config.webApiUrl + "/patients/add_patient", data, { headers: tokenData })
        .subscribe(data => {
          resolve(data);
        }, (err) => {
          reject(err);
        });
    });
  }

  addPatientScanFile(tokenData, data) {
    return new Promise((resolve, reject) => {
      this.http.post(this.config.webApiUrl + "/patients/files/add_file", data, { headers: tokenData })
        .subscribe(data => {
          resolve(data);
        }, (err) => {
          reject(err);
        });
    });
  }

  deletePatientFile(tokenData, data) {
    return new Promise((resolve, reject) => {
      this.http.post(this.config.webApiUrl + "/patients/files/delete_file", data, { headers: tokenData })
        .subscribe(data => {
          resolve(data);
        }, (err) => {
          reject(err);
        });
    });
  }

  movePatientFile(tokenData, data) {
    return new Promise((resolve, reject) => {
      this.http.post(this.config.webApiUrl + "/patients/files/move_file", data, { headers: tokenData })
        .subscribe(data => {
          resolve(data);
        }, (err) => {
          reject(err);
        });
    });
  }

  // Update brief history of the patient
  updatePatientPresentation(tokenData, data) {
    return new Promise((resolve, reject) => {
      this.http.post(this.config.webApiUrl + "/patients/update_patient_presentation", data, { headers: tokenData })
        .subscribe(data => {
          resolve(data);
        }, (err) => {
          reject(err);
        });
    });
  }

  // Update scan times of the patient
  updateScanTimesofPatient(tokenData, data) {
    return new Promise((resolve, reject) => {
      this.http.post(this.config.webApiUrl + "/patients/update_patient_scan_times", data, { headers: tokenData })
        .subscribe(data => {
          resolve(data);
        }, (err) => {
          reject(err);
        });
    });
  }


  // Uploaded scans of the patient
  scansUploadedAlertToTeam(tokenData, data) {
    return new Promise((resolve, reject) => {
      this.http.post(this.config.webApiUrl + "/patients/update_scans_uploaded", data, { headers: tokenData })
        .subscribe(data => {
          resolve(data);
        }, (err) => {
          reject(err);
        });
    });
  }

  // Update Patient Medications
  updatePatientMedications(tokenData, data) {
    return new Promise((resolve, reject) => {
      this.http.post(this.config.webApiUrl + "/patients/update_patient_medications", data, { headers: tokenData })
        .subscribe(data => {
          resolve(data);
        }, (err) => {
          reject(err);
        });
    });
  }

  // Update Patient Contradictions
  updatePatientContradictions(tokenData, data) {
    return new Promise((resolve, reject) => {
      this.http.post(this.config.webApiUrl + "/patients/update_patient_contradictions", data, { headers: tokenData })
        .subscribe(data => {
          resolve(data);
        }, (err) => {
          reject(err);
        });
    });
  }



  // Update Complications
  updatePatientComplications(tokenData, data) {
    return new Promise((resolve, reject) => {
      this.http.post(this.config.webApiUrl + "/patients/update_patient_complications", data, { headers: tokenData })
        .subscribe(data => {
          resolve(data);
        }, (err) => {
          reject(err);
        });
    });
  }



  // Update Basic tests of the patient
  updatePatientBasicData(tokenData, data) {
    return new Promise((resolve, reject) => {
      this.http.post(this.config.webApiUrl + "/patients/update_patient_basic_data", data, { headers: tokenData })
        .subscribe(data => {
          resolve(data);
        }, (err) => {
          reject(err);
        });
    });
  }

  // Update Custom Messages
  postCustomPushNotficationsAndSMSs(tokenData, data) {
    return new Promise((resolve, reject) => {
      this.http.post(this.config.webApiUrl + "/patients/send_custom_update", data, { headers: tokenData })
        .subscribe(data => {
          resolve(data);
        }, (err) => {
          reject(err);
        });
    });
  }

  // Update the MRS of a patient
  updateMRSofPatient(tokenData, data) {
    return new Promise((resolve, reject) => {
      this.http.post(this.config.webApiUrl + "/patients/update_patient_mrs", data, { headers: tokenData })
        .subscribe(data => {
          resolve(data);
        }, (err) => {
          reject(err);
        });
    });
  }

  // Update the NIHSS of a patient
  updateNIHSSofPatient(tokenData, data) {
    return new Promise((resolve, reject) => {
      this.http.post(this.config.webApiUrl + "/patients/update_patient_nihss", data, { headers: tokenData })
        .subscribe(data => {
          resolve(data);
        }, (err) => {
          reject(err);
        });
    });
  }

  // Alert Hub
  alertHubAndStartTransition(tokenData, data) {
    return new Promise((resolve, reject) => {
      this.http.post(this.config.webApiUrl + "/patients/start_patient_transition_to_hub", data, { headers: tokenData })
        .subscribe(data => {
          resolve(data);
        }, (err) => {
          reject(err);
        });
    });
  }

  // Alert Spoke
  alertSpokeAndStartTransition(tokenData, data) {
    return new Promise((resolve, reject) => {
      this.http.post(this.config.webApiUrl + "/patients/start_patient_transition_to_spoke", data, { headers: tokenData })
        .subscribe(data => {
          resolve(data);
        }, (err) => {
          reject(err);
        });
    });
  }

  getNearestHubSpokeCenters(tokenData, patientId) {
    return new Promise((resolve, reject) => {
      this.http.get(this.config.webApiUrl + "/patients/get_hub_spoke_centers/" + patientId, { headers: tokenData })
        .subscribe(data => {
          resolve(data);
        }, (err) => {
          reject(err);
        });
    });
  }

  //  // Get List of Consultants who are online now
  //  getOnlineConsultants(tokenData, patientId){
  //   return new Promise((resolve, reject) => {
  //       this.http.get(this.config.webApiUrl+"/consultants/online_consultants/"+patientId, {headers: tokenData})
  //         .subscribe(data => {
  //             resolve(data);
  //         }, (err) => {
  //           reject(err);
  //         });
  //     });
  // }


  // // Allot a Patient to the Consultant
  // allotPatientToConsultant(tokenData, data){
  //   return new Promise((resolve, reject) => {
  //       this.http.post(this.config.webApiUrl+"/consultants/allot_patient", data ,{headers: tokenData})
  //         .subscribe(data => {
  //             resolve(data);
  //         }, (err) => {
  //           reject(err);
  //         });
  //     });
  // }

  // leaveAdvise(tokenData, data){
  //   return new Promise((resolve, reject) => {
  //       this.http.post(this.config.webApiUrl+"/consultants/advise", data ,{headers: tokenData})
  //         .subscribe(data => {
  //             resolve(data);
  //         }, (err) => {
  //           reject(err);
  //         });
  //     });
  // }

  // Get Online users in Analysis Page
  getOnlineUsers(tokenData, patientId) {
    return new Promise((resolve, reject) => {
      this.http.get(this.config.webApiUrl + "/patient_analysis/get_online_users/" + patientId, { headers: tokenData })
        .subscribe(data => {
          resolve(data);
        }, (err) => {
          reject(err);
        });
    });
  }


  addRemoveFromOnlineUsers(tokenData, patientId, add_remove) {
    return new Promise((resolve, reject) => {
      this.http.post(this.config.webApiUrl + "/patient_analysis/online_offline_status/" + patientId + "/" + add_remove, {}, { headers: tokenData })
        .subscribe(data => {
          resolve(data);
        }, (err) => {
          reject(err);
        });
    });
  }


  // Get Comments in Analysis Page
  getComments(tokenData, patientId) {
    return new Promise((resolve, reject) => {
      this.http.get(this.config.webApiUrl + "/patient_analysis/get_comments/" + patientId, { headers: tokenData })
        .subscribe(data => {
          resolve(data);
        }, (err) => {
          reject(err);
        });
    });
  }

  postComment(tokenData, data) {
    return new Promise((resolve, reject) => {
      this.http.post(this.config.webApiUrl + "/patient_analysis/post_comment", data, { headers: tokenData })
        .subscribe(data => {
          resolve(data);
        }, (err) => {
          reject(err);
        });
    });
  }

  postCommentNotification(tokenData, data) {
    return new Promise((resolve, reject) => {
      this.http.post(this.config.webApiUrl + "/patient_analysis/post_comment_push", data, { headers: tokenData })
        .subscribe(data => {
          resolve(data);
        }, (err) => {
          reject(err);
        });
    });
  }

  // Get Transistion Statuses
  getTransitionStatuses(tokenData, patientId) {
    return new Promise((resolve, reject) => {
      this.http.get(this.config.webApiUrl + "/patient_analysis/get_transition_statueses/" + patientId, { headers: tokenData })
        .subscribe(data => {
          resolve(data);
        }, (err) => {
          reject(err);
        });
    });
  }

  postTransitionStatus(tokenData, data) {
    return new Promise((resolve, reject) => {
      this.http.post(this.config.webApiUrl + "/patient_analysis/post_transition_status", data, { headers: tokenData })
        .subscribe(data => {
          resolve(data);
        }, (err) => {
          reject(err);
        });
    });
  }

  // Get Conclusion types
  getConclusionTypes(tokenData, patientId) {
    return new Promise((resolve, reject) => {
      this.http.get(this.config.webApiUrl + "/patient_analysis/get_conclusion_types/" + patientId, { headers: tokenData })
        .subscribe(data => {
          resolve(data);
        }, (err) => {
          reject(err);
        });
    });
  }

  postConclusion(tokenData, data) {
    return new Promise((resolve, reject) => {
      this.http.post(this.config.webApiUrl + "/patient_analysis/post_conclusion", data, { headers: tokenData })
        .subscribe(data => {
          resolve(data);
        }, (err) => {
          reject(err);
        });
    });
  }

  // Get Conversations
  getConversations(tokenData) {
    return new Promise((resolve, reject) => {
      let data = {};
      this.http.post(this.config.webApiUrl + "/conversations/all", data, { headers: tokenData })
        .subscribe(data => {
          resolve(data);
        }, (err) => {
          reject(err);
        });
    });
  }

  // Fetch Online Users for Internal Conversation
  fetchAllOnlineUsers(tokenData) {
    return new Promise((resolve, reject) => {
      this.http.get(this.config.webApiUrl + "/conversations/get_all_online_users", { headers: tokenData })
        .subscribe(data => {
          resolve(data);
        }, (err) => {
          reject(err);
        });
    });
  }

  // Create Comversation
  createConversation(tokenData, userId, eventId) {
    return new Promise((resolve, reject) => {
      let data = {};
      this.http.post(this.config.webApiUrl + "/conversations/create_conversation/" + userId + "/" + eventId, data, { headers: tokenData })
        .subscribe(data => {
          resolve(data);
        }, (err) => {
          reject(err);
        });
    });
  }

  // Create Comversation
  createInternalConversation(tokenData, userId) {
    return new Promise((resolve, reject) => {
      let data = {};
      this.http.post(this.config.webApiUrl + "/conversations/create_internal_conversation/" + userId, data, { headers: tokenData })
        .subscribe(data => {
          resolve(data);
        }, (err) => {
          reject(err);
        });
    });
  }

  // Send Last Message
  createLastMessageInConversation(tokenData, chatId, data) {
    return new Promise((resolve, reject) => {
      this.http.post(this.config.webApiUrl + "/conversations/create_last_message/" + chatId, data, { headers: tokenData })
        .subscribe(data => {
          resolve(data);
        }, (err) => {
          reject(err);
        });
    });
  }

  sendPushMessageChat(tokenData, chatId, data) {
    return new Promise((resolve, reject) => {
      this.http.post(this.config.webApiUrl + "/conversations/create_last_message_push_notification/" + chatId, data, { headers: tokenData })
        .subscribe(data => {
          resolve(data);
        }, (err) => {
          reject(err);
        });
    });
  }

  getConversation(tokenData, chatId) {
    return new Promise((resolve, reject) => {
      let data = {};
      this.http.post(this.config.webApiUrl + "/conversations/conversation/" + chatId, data, { headers: tokenData })
        .subscribe(data => {
          resolve(data);
        }, (err) => {
          reject(err);
        });
    });
  }

  deleteConversation(tokenData, chatId, otherUserId) {
    return new Promise((resolve, reject) => {
      let data = {};
      this.http.post(this.config.webApiUrl + "/conversations/delete_conversation/" + chatId + "/" + otherUserId, data, { headers: tokenData })
        .subscribe(data => {
          resolve(data);
        }, (err) => {
          reject(err);
        });
    });
  }

  countUnreadChats(tokenData) {
    return new Promise((resolve, reject) => {
      let data = {};
      this.http.post(this.config.webApiUrl + "/conversations/count_unread_chats", data, { headers: tokenData })
        .subscribe(data => {
          resolve(data);
        }, (err) => {
          reject(err);
        });
    });
  }

  blockUnlockUser(tokenData, userId, reasonData) {
    return new Promise((resolve, reject) => {
      this.http.post(this.config.webApiUrl + "/conversations/block_unblock_user/" + userId, reasonData, { headers: tokenData })
        .subscribe(data => {
          resolve(data);
        }, (err) => {
          reject(err);
        });
    });
  }

  codeStrokeAlert(tokenData, patientId) {
    return new Promise((resolve, reject) => {
      this.http.post(this.config.webApiUrl + "/patients/code_stroke_alert_manually", { 'patient_id': patientId }, { headers: tokenData })
        .subscribe(data => {
          resolve(data);
        }, (err) => {
          reject(err);
        });
    });
  }
  stopClockManually(tokenData, data) {
    return new Promise((resolve, reject) => {
      this.http.post(this.config.webApiUrl + "/patients/stop_clocks", data, { headers: tokenData })
        .subscribe(data => {
          resolve(data);
        }, (err) => {
          reject(err);
        });
    });
  }

  getQualityMatrix(tokenData, patientType, timePeriod) {
    return new Promise((resolve, reject) => {
      this.http.get(this.config.webApiUrl + "/patients/get_bulk_timings/" + patientType + "/" + timePeriod, { headers: tokenData })
        .subscribe(data => {
          resolve(data);
        }, (err) => {
          reject(err);
        });
    });
  }

}
