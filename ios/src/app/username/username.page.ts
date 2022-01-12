import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';
import { Validators, FormGroup, FormControl } from '@angular/forms';
import { NavigationExtras, Router } from '@angular/router';

import { LoadingService } from '../../services/loading.service';
import { ApiService } from '../../services/api.service';
import { AuthService } from '../../services/auth.service';

@Component({
	selector: 'app-username',
	templateUrl: './username.page.html',
	styleUrls: ['./username.page.scss'],
})
export class UsernamePage implements OnInit {

	loginForm: FormGroup;
	errors:any;

	validations = {
		'email': [
			{ type: 'required', message: 'Email address field is required.' },
			{ type: 'pattern', message: 'Enter a valid email address.' },
		],
		'password': [
			{ type: 'required', message: 'Password field is required.' },
			{ type: 'minlength', message: 'Password must be at least 8 characters long.' }
		],
		'hash': [
			{ type: 'required', message: 'Hash field is required.' }
		],
	};


	constructor(
		public loading : LoadingService,
		public api : ApiService,
		public router: Router,
		public auth: AuthService,
		private navCtrl:NavController,
	) { 
		this.loginForm = new FormGroup({
			'email': new FormControl('', Validators.compose([
				Validators.required,
				Validators.pattern('^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+$')
			])),
			'password': new FormControl('', Validators.compose([
				Validators.minLength(6),
				Validators.required
			])),
			'hash': new FormControl('')
		});
	}

  	ngOnInit() {
  	}

	async doLogin() {
		await this.loading.open();
  		await this.api.open('login',this.loginForm.value).then((response) => {
            this.loading.close();
			this.auth.login(response);
		  	this.navCtrl.navigateRoot('/tabs/cart');  
        },
        (error) => {
			this.loading.close();
			this.loading.presentAlert('Message',error.error.message)
        });
  	}

}
