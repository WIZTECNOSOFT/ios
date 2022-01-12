import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../environments/environment';
import { Storage } from '@ionic/storage';
import { NavController } from '@ionic/angular';

@Injectable({
	providedIn: 'root'
})
export class ApiService {

	url = environment.apiUrl

	constructor(
		private http: HttpClient,
		private storage: Storage,
		private navCtrl:NavController,
	){

	}

	open(uri,data) {
		return new Promise((resolve, reject) => {
			this.http.post(this.url+uri, data)
			.subscribe(response => {
				resolve(response);
			}, 
			(error) => {
				reject(error);
			});
		});
	}

	httpCall(uri,data,token) {
        return new Promise((resolve, reject) => {
            this.http.post(this.url+uri, data, {
                headers: new HttpHeaders().set('Authorization', 'Bearer' + ' ' + token)
             })
            .subscribe(response => {
                resolve(response);	
            }, 
            (error) => {
                reject(error);
            });
        });
	}
	
	logout() {
		this.storage.remove('user');
		this.navCtrl.navigateRoot('/');
	}
}
