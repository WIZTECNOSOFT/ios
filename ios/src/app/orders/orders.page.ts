import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, NavigationExtras} from '@angular/router';

import { LoadingService } from '../../services/loading.service';
import { ApiService } from '../../services/api.service';
import { AuthService } from '../../services/auth.service';

import * as moment from 'moment';

@Component({
  selector: 'app-orders',
  templateUrl: './orders.page.html',
  styleUrls: ['./orders.page.scss'],
})
export class OrdersPage implements OnInit {

	page=1;
	last_page=0;
	search="";
	user:any;
	orders:any;
	errors:any;
	fakes = [1,2,3,4,5,6,7,8,9,10];

	constructor(
		public loading : LoadingService,
		public api : ApiService,
		private route: ActivatedRoute,
		public router: Router,
		public auth : AuthService
	){

	}

	ngOnInit() {
	}

	ionViewWillEnter() {
		if(this.auth.authenticated){
			this.user = this.auth.user;
			this.page = 1;
			this.last_page = 0;
			this.getOrders()
		}
	}

	async getOrders() {
		let data = {
			user_id:this.user.user_id,
			page:this.page,
			search:this.search,
		}
		await this.api.httpCall('getOrders',data,'')
		.then((response) => {
			this.orders = response['data'];
			this.last_page = response['meta'].last_page;
        },
        (error) => {
			this.errors = error.error.errors;
        });
	}

	async loadMore(event) {
		this.page++;
		let data = {
			user_id:this.user.user_id,
			page:this.page,
			search:this.search,
		}
		await this.api.httpCall('getOrders',data,'')
		.then((response) => {
			this.orders = this.orders.concat(response['data']);
			this.last_page = response['meta'].last_page;
			if(event) {
				event.target.complete();
			}
        },
        (error) => {
        	this.errors = error.error.error;
        });
	}

	async doRefresh(event) {
		this.page = 1;
		let data = {
			user_id:this.user.user_id,
			page:this.page,
			search:this.search,
		}
		await this.api.httpCall('getOrders',data,'')
		.then((response) => {
			event.target.complete();
			this.orders = response['data'];
			this.last_page = response['meta'].last_page;
		},
		(error) => {
			this.errors = error.error.errors;
		});
  	}

	searchOrder(ev: any) {
		this.page = 1;
		this.last_page = 1;
		this.search = ev.target.value;
		this.getOrders();
	}

	openOrder(order) {
		let navigationExtras: NavigationExtras = {
			state: {
				order: order,
			}
		};
		this.router.navigate(['/order'],navigationExtras);
	}

	convertTime(time) {
		return moment(time).format('DD-MM-YY');
	}

}
