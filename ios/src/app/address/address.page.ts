import { Component, OnInit } from '@angular/core';
import { Validators, FormGroup, FormControl } from '@angular/forms';
import { ActivatedRoute, Router, NavigationExtras} from '@angular/router';

import { LoadingService } from '../../services/loading.service';
import { ApiService } from '../../services/api.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-address',
  templateUrl: './address.page.html',
  styleUrls: ['./address.page.scss'],
})
export class AddressPage implements OnInit {

	addressForm: FormGroup;
	address: any;
	locationCoords: any;
	errors:any;

	validations = {
		'user_id': [
			{ type: 'required', message: 'User field is required.' }
		],
		'address_type': [
			{ type: 'required', message: 'address type field is required.' }
		],
		'address': [
			{ type: 'required', message: 'address field is required.' }
		],
		'location': [
			{ type: 'required', message: 'location field is required.' }
		],
		'pincode': [
			{ type: 'required', message: 'pincode field is required.' }
		],
		'latitude': [
			{ type: 'required', message: 'latitude field is required.' }
		],
		'longitude': [
			{ type: 'required', message: 'longitude field is required.' }
		]
	};

	constructor(
		private route: ActivatedRoute,
		public router: Router,
		public loading : LoadingService,
		public api : ApiService,
		public auth : AuthService
	) {
		this.addressForm = new FormGroup({
			'user_id': new FormControl('', Validators.compose([
				Validators.required
			])),
			'address_type': new FormControl('', Validators.compose([
				Validators.required
			])),
			'address': new FormControl('', Validators.compose([
				Validators.required
			])),
			'location': new FormControl(''),
			'pincode': new FormControl('', Validators.compose([
				Validators.required,
			])),
			'latitude': new FormControl(''),
			'longitude': new FormControl(''),
		});

		this.route.queryParams.subscribe(params => {
			if(this.router.getCurrentNavigation().extras.state) {
				this.locationCoords = this.router.getCurrentNavigation().extras.state.locationCoords;
				this.setLocationCoords()
			}
		});
	}

	ngOnInit() {
		
	}

	ionViewWillEnter() {
		if(this.auth.authenticated){
			this.addressForm.controls["user_id"].setValue(this.auth.user.user_id);
		}
	}

	setLocationCoords() {
		console.log(this.locationCoords);
		this.addressForm.controls["address_type"].setValue('Home');
		this.addressForm.controls["address"].setValue(this.locationCoords.address);
		this.addressForm.controls["location"].setValue(this.locationCoords.address);
		this.addressForm.controls["pincode"].setValue(this.locationCoords.pincode);
		this.addressForm.controls["latitude"].setValue(this.locationCoords.latitude);
		this.addressForm.controls["longitude"].setValue(this.locationCoords.longitude);
	}

	async saveAddress() {
		await this.loading.open();
  		await this.api.open('addAddress',this.addressForm.value).then((response) => {
			this.loading.close();
			this.loading.message('Address is added successfully');
			this.router.navigate(['/addresses']);
        },
        (error) => {
			this.loading.close();
			this.loading.presentAlert('Message',error.error.message)
        });
	}
}

