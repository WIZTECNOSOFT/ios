import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, NavigationExtras} from '@angular/router';
import { Storage } from '@ionic/storage';

import { LoadingService } from '../../services/loading.service';
import { ApiService } from '../../services/api.service';
import { CartService } from '../../services/cart.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.page.html',
  styleUrls: ['./cart.page.scss'],
})
export class CartPage implements OnInit {

	constructor(
		public loading : LoadingService,
		public api : ApiService,
		public cart : CartService,
		public auth : AuthService,
		private route: ActivatedRoute,
		public router: Router,
		private storage: Storage,
	) { 
	}

  	ngOnInit() {
  	}

	next() {
		if(this.auth.authenticated){
			this.router.navigate(['/addresses']);
		}
		else {
			this.router.navigate(['/username']);
		}
	}

	openProduct(product) {
		let navigationExtras: NavigationExtras = {
			state: {
				product: product,
			}
		};
		this.router.navigate(['/product'],navigationExtras);
	}

}
