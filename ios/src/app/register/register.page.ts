import { Component, OnInit } from '@angular/core';
import { Validators, FormGroup, FormControl } from '@angular/forms';
import { NavigationExtras, Router } from '@angular/router';

import { LoadingService } from '../../services/loading.service';
import { ApiService } from '../../services/api.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
})
export class RegisterPage implements OnInit {

  	registerForm: FormGroup;
	errors:any;

	validations = {
		'name': [
			{ type: 'required', message: 'Name field is required.' },
		],
		'email': [
			{ type: 'required', message: 'Email field is required.' },
			{ type: 'pattern', message: 'Enter a valid email.' },
		],
		'mobile_no': [
			{ type: 'required', message: 'Mobile number field is required.' },
			{ type: 'pattern', message: 'Enter a valid mobile number.' },
		],
		'password': [
			{ type: 'required', message: 'Password field is required.' },
			{ type: 'minlength', message: 'Password must be at least 8 characters long.' }
		],
		'hash': [
			{ type: 'required', message: 'Hash field is required.' }
		],
		'role': [
			{ type: 'required', message: 'Role field is required.' }
		],
	};


	constructor(
		public loading : LoadingService,
		public api : ApiService,
		public router: Router,
	) { 
		this.registerForm = new FormGroup({
			'name': new FormControl('', Validators.compose([
				Validators.required,
			])),
      		'email': new FormControl('', Validators.compose([
				Validators.required,
			])),
      		'mobile_no': new FormControl('', Validators.compose([
				Validators.required,
				Validators.pattern('^([0|\+[0-9]{1,5})?([6-9][0-9]{9})$'),
			])),
			'password': new FormControl('', Validators.compose([
				Validators.minLength(8),
				Validators.required
			])),
			'hash': new FormControl(''),
			'role': new FormControl(''),
		});
	}

  	ngOnInit() {
		this.registerForm.controls["role"].setValue('Customer');
  	}

	async register() {
		await this.loading.open();
  		await this.api.open('ios_register',this.registerForm.value).then((response) => {
			this.sendOtp()
        },
        (error) => {
			this.loading.close();
			this.loading.presentAlert('Message',error.error.message)
        });
  	}

	async sendOtp() {
  		await this.api.open('sendOtp',this.registerForm.value).then((response) => {
            this.loading.close();
			let navigationExtras: NavigationExtras = {
				state: {
					user: this.registerForm.value,
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
