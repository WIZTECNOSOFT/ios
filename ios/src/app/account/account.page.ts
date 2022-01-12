import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, NavigationExtras} from '@angular/router';
import { NavController } from '@ionic/angular';

import { LoadingService } from '../../services/loading.service';
import { ApiService } from '../../services/api.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-account',
  templateUrl: './account.page.html',
  styleUrls: ['./account.page.scss'],
})
export class AccountPage implements OnInit {

	user=null;
	errors:any;
	pages:any;

	constructor(
		private route: ActivatedRoute,
		public router: Router,
		public loading : LoadingService,
		public api : ApiService,
		public auth : AuthService,
		private navCtrl:NavController,
	) {

	}

  	ngOnInit() {
		this.getPages();
  	}

	ionViewWillEnter() {
		if(this.auth.authenticated){
			this.user = this.auth.user;
		}
	}

	getFirstLetter() {
		return this.user.name.charAt(0);
	}

	async getPages() {
		await this.api.httpCall('getPages','','')
		.then((response) => {
			this.pages = response['data']
        },
        (error) => {
			this.errors = error.error.errors;
        });
	}

	openAddresses() {
		let navigationExtras: NavigationExtras = {
			state: {
				mode: 'edit',
			}
		};
		this.router.navigate(['/addresses'],navigationExtras);
	}

	openPages(page) {
		let navigationExtras: NavigationExtras = {
			state: {
				page: page,
			}
		};
		this.router.navigate(['/pages'],navigationExtras);
	}

	openProfile() {
		this.router.navigate(['/profile']);
	}

	openOrders() {
		this.router.navigate(['/orders']);
	}

	async logout() {
		await this.loading.open();
		await this.auth.logout();
		await this.loading.close();
		this.user = null;	
	}

}
