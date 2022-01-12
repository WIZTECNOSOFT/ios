import { Component, OnInit } from '@angular/core';
import { Validators, FormGroup, FormControl } from '@angular/forms';
import { ActivatedRoute, Router, NavigationExtras} from '@angular/router';

import { LoadingService } from '../../services/loading.service';
import { ApiService } from '../../services/api.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-addresses',
  templateUrl: './addresses.page.html',
  styleUrls: ['./addresses.page.scss'],
})
export class AddressesPage implements OnInit {

	addresses: any;
	errors:any;
	user:any;
	fakes = [0,1];
	mode = "select";
	order = {
		user_id:'',
		address_id:'',
		address:{},
	}

	constructor(
		private route: ActivatedRoute,
		public router: Router,
		public loading : LoadingService,
		public api : ApiService,
		public auth : AuthService
	) {
		if(this.router.getCurrentNavigation().extras.state) {
			this.mode = this.router.getCurrentNavigation().extras.state.mode;
		}
	}

  	ngOnInit() {
		
  	}

	ionViewWillEnter() {
		if(this.auth.authenticated){
			this.user = this.auth.user;
			this.order.user_id = this.user.user_id;
			this.getAddresses();
		}
	}

	async getAddresses() {
		await this.api.httpCall('getAddresses',this.user,this.user.token)
		.then((response) => {
			this.addresses = response['data']
        },
        (error) => {
			this.errors = error.error.errors;
        });
	}

	selectAddress(address) {
		this.order.address = address;
	}

	proceed() {
		if(this.order.address_id=='') {
			this.loading.presentAlert('Message','Please select address to continue..!')
		}
		else {
			let navigationExtras: NavigationExtras = {
				state: {
					order: this.order,
				}
			};
			this.router.navigate(['/shipping-methods'],navigationExtras);
		}
	}
}
