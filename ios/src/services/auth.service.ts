import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

	user=null;
	authenticated=false;

	constructor(
		private storage: Storage,
	){
		this.storage.get('user').then((data) => {
			if(data!=null) {
				this.user = data;
				this.authenticated=true;
			}
		});
	}

	login(user) {
		this.storage.set('user',user);
		this.user = user;
		this.authenticated=true;
	}

	logout() {
		this.storage.remove('user');
		this.user = null;
		this.authenticated=false;
	}
}
