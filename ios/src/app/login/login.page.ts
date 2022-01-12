import { Component, OnInit } from '@angular/core';
import { Validators, FormGroup, FormControl } from '@angular/forms';
import { NavigationExtras, Router } from '@angular/router';

import { LoadingService } from '../../services/loading.service';
import { ApiService } from '../../services/api.service';


@Component({
  	selector: 'app-login',
  	templateUrl: './login.page.html',
  	styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {

	loginForm: FormGroup;
	errors:any;

	validations = {
		'mobile_no': [
			{ type: 'required', message: 'Mobile number field is required.' },
			{ type: 'pattern', message: 'Enter a valid mobile number.' },
		],
		'hash': [
			{ type: 'required', message: 'Hash field is required.' }
		],
	};


	constructor(
		public loading : LoadingService,
		public api : ApiService,
		public router: Router,
	) { 
		this.loginForm = new FormGroup({
			'mobile_no': new FormControl('', Validators.compose([
				Validators.required,
				Validators.pattern('^([0|\+[0-9]{1,5})?([6-9][0-9]{9})$'),
			])),
			'hash': new FormControl('')
		});
	}

  	ngOnInit() {
  	}

	async sendOtp() {
		await this.loading.open();
  		await this.api.open('sendOtp',this.loginForm.value).then((response) => {
            this.loading.close();
			let navigationExtras: NavigationExtras = {
				state: {
					user: this.loginForm.value,
				}
			};
			this.router.navigate(['/otp'],navigationExtras);
        },
        (error) => {
			this.loading.close();
			this.loading.presentAlert('Message',error.error.message)
        });
  	}
}
