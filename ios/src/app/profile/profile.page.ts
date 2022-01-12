import { Component, OnInit } from '@angular/core';
import { Validators, FormGroup, FormControl } from '@angular/forms';
import { NavController } from '@ionic/angular';
import { LoadingService } from '../../services/loading.service';
import { ApiService } from '../../services/api.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
})
export class ProfilePage implements OnInit {

	profileForm: FormGroup;
	user:any;
	errors:any;

	validations = {
		'user_id': [
			{ type: 'required', message: 'User Id field is required.' },
		],
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
		]
	};

	constructor(
		private navCtrl:NavController,
		public loading : LoadingService,
		public api : ApiService,
		public auth : AuthService
	) { 
		this.profileForm = new FormGroup({
			'user_id': new FormControl('', Validators.compose([
				Validators.required,
			])),
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
		});
	}

  	ngOnInit() {
  	}

	ionViewWillEnter() {
		if(this.auth.authenticated){
			this.user = this.auth.user;
			this.profileForm.controls["user_id"].setValue(this.user.user_id);
			this.profileForm.controls["name"].setValue(this.user.name);
			this.profileForm.controls["email"].setValue(this.user.email);
			this.profileForm.controls["mobile_no"].setValue(this.user.mobile_no);
		}
	}

	async updateProfile() {
		await this.loading.open();
  		await this.api.open('updateProfile',this.profileForm.value).then((response) => {
			this.loading.close();
			this.auth.login(response);
		  	this.navCtrl.navigateRoot('/tabs/home');  
        },
        (error) => {
			this.loading.close();
			this.loading.presentAlert('Message',error.error.message)
        });
  	}

}
