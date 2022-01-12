import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';
import { Validators, FormGroup, FormControl } from '@angular/forms';
import { ActivatedRoute, Router, NavigationExtras} from '@angular/router';

import { LoadingService } from '../../services/loading.service';
import { ApiService } from '../../services/api.service';
import { AuthService } from '../../services/auth.service';

@Component({
	selector: 'app-otp',
	templateUrl: './otp.page.html',
	styleUrls: ['./otp.page.scss'],
})
export class OtpPage implements OnInit {

	otpForm: FormGroup;
	user:any;
	errors: any;

	validations = {
		'mobile_no': [
			{ type: 'required', message: 'Mobile number field is required.' },
			{ type: 'pattern', message: 'Enter a valid mobile number.' },
		],
		'otp': [
			{ type: 'required', message: 'otp field is required.' }
		]
	};


	constructor(
		private navCtrl:NavController,
		public loading: LoadingService,
		public api: ApiService,
		public auth: AuthService,
		private route: ActivatedRoute,
		public router: Router,
	) {
		this.otpForm = new FormGroup({
			'mobile_no': new FormControl('', Validators.compose([
				Validators.required,
				Validators.pattern('^([0|\+[0-9]{1,5})?([6-9][0-9]{9})$'),
			])),
			'otp': new FormControl('', Validators.compose([
				Validators.required
			]))
		});

		this.route.queryParams.subscribe(params => {
			if(this.router.getCurrentNavigation().extras.state) {
				this.user = this.router.getCurrentNavigation().extras.state.user;
				this.otpForm.controls["mobile_no"].setValue(this.user.mobile_no);
			}
		});
	}

	ngOnInit() {

	}

	async verifyOtp() {
		await this.loading.open();
		await this.api.open('verifyOtp',this.otpForm.value).then((response) => {
		  this.loading.close();
		  this.auth.login(response);
		  this.navCtrl.navigateRoot('/tabs/cart');  
	  	},
		(error) => {
			this.loading.close();
			this.loading.presentAlert('Message',error.error.message)
		});
	}

	async resendOtp() {
		await this.loading.open();
		await this.api.open('resendOtp',this.otpForm.value).then((response) => {
		  this.loading.close();
	  	},
		(error) => {
			this.loading.close();
			this.loading.presentAlert('Message',error.error.message)
		});
	}
}
