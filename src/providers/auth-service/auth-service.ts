import { HttpClient } from '@angular/common/http';
import {Injectable} from '@angular/core';
import { Config } from '../../app/app.config';

@Injectable()
export class AuthServiceProvider {
    
  constructor(public http: HttpClient, private config: Config) {
    console.log('Hello AuthServiceProvider Provider');
  }

   // Login a user
   login(data) {
        return new Promise((resolve, reject) => {
          this.http.post(this.config.webApiUrl+"/auth/login", data)
            .subscribe(data => {
                resolve(data);
            }, (err) => {
              reject(err);
            });
        });
   } 

   
   // Signup a user
   signup(data) {
        return new Promise((resolve, reject) => {
          this.http.post(this.config.webApiUrl+"/auth/signup", data)
            .subscribe(data => {
                resolve(data);
            }, (err) => {
              reject(err);
            });
        });
    } 

   // Retreive a password
   forgotpassword(data) {
      return new Promise((resolve, reject) => {
        this.http.post(this.config.webApiUrl+"/auth/forgotpassword", data)
          .subscribe(data => {
              resolve(data);
          }, (err) => {
            reject(err);
          });
      });
  }    


  // Change Password: old_password, new_password, repeat_password
  changePassword(tokenData, data) {
      return new Promise((resolve, reject) => {
        this.http.post(this.config.webApiUrl+"/auth/change_password", data, {headers: tokenData})
          .subscribe(data => {
              resolve(data);
          }, (err) => {
            reject(err);
          });
      });
  }  

  // Check User Session
  checkUserSession(tokenData) {
    return new Promise((resolve, reject) => {
      this.http.post(this.config.webApiUrl+"/auth/check_user_session", {}, {headers: tokenData})
        .subscribe(data => {
            resolve(data);
        }, (err) => {
          reject(err);
        });
    });
}  
   
}
