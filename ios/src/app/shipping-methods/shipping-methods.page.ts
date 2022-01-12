import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, NavigationExtras} from '@angular/router';

import { LoadingService } from '../../services/loading.service';
import { ApiService } from '../../services/api.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-shipping-methods',
  templateUrl: './shipping-methods.page.html',
  styleUrls: ['./shipping-methods.page.scss'],
})
export class ShippingMethodsPage implements OnInit {

	shipping_methods: any;
	shipping_slabs: any;
	errors:any;
	today:any;
	order = {
		user_id:'',
		address_id:'',
		address:null,
		shipping_method_id:'',
		shipping_method:null,
		delivery_date:'',
		slab_id:'',
		slab:null,
		shipping_slab_id:'',
		shipping_slab:null,
	}

	constructor(
		private route: ActivatedRoute,
		public router: Router,
		public loading : LoadingService,
		public api : ApiService,
		public auth : AuthService
	) {
		this.route.queryParams.subscribe(params => {
			if(this.router.getCurrentNavigation().extras.state) {
				let order = this.router.getCurrentNavigation().extras.state.order;
				this.order.user_id = order.user_id;
				this.order.address_id = order.address_id;
				this.order.address = order.address;
			}
		});
	}

  	ngOnInit() {
		this.getShippingMethods();
		this.today = new Date().toISOString();
		this.order.delivery_date =new Date().toISOString();
  	}

	async getShippingMethods() {
		await this.api.httpCall('getShippingMethods',this.order,'')
		.then((response) => {
			this.shipping_methods = response['data'];
        },
        (error) => {
			this.errors = error.error.errors;
        });
	}

	selectShippingMethod(shipping_method) {
		this.order.shipping_method = shipping_method;
		this.getShippingSlabs();
	}

	async getShippingSlabs() {
		this.order.shipping_slab_id = '';
		this.order.shipping_slab = null;
		this.order.slab_id = '';
		this.order.slab = null;
		await this.loading.open();
		await this.api.httpCall('getShippingSlabs',this.order,'')
		.then((response) => {
			this.loading.close();
			this.shipping_slabs = response['data'];
        },
        (error) => {
			this.loading.close();
			this.errors = error.error.errors;
        });
	}

	selectShippingSlab(shipping_slab) {
		this.order.shipping_slab = shipping_slab;
		this.order.slab = shipping_slab.slab;
		this.order.slab_id = shipping_slab.slab_id;
	}

	proceed() {
		if(this.order.shipping_method_id=='') {
			this.loading.presentAlert('Message','Please select shipping method to continue..!')
		}
		else if(this.order.shipping_slab_id=='' && this.shipping_slabs && this.shipping_slabs?.length!=0) {
			this.loading.presentAlert('Message','Please select shipping slab to continue..!')
		}
		else {
			let navigationExtras: NavigationExtras = {
				state: {
					order: this.order,
				}
			};
			this.router.navigate(['/payment-methods'],navigationExtras);
		}
	}
	
}
