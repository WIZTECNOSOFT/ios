import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, NavigationExtras} from '@angular/router';

import { LoadingService } from '../../services/loading.service';
import { ApiService } from '../../services/api.service';
import { CartService } from '../../services/cart.service';

@Component({
  selector: 'app-product',
  templateUrl: './product.page.html',
  styleUrls: ['./product.page.scss'],
})
export class ProductPage implements OnInit {

	product:any;
	product_price_id:'';

	constructor(
		public loading : LoadingService,
		public api : ApiService,
		public cart : CartService,
		private route: ActivatedRoute,
		public router: Router,
	) { 
		this.route.queryParams.subscribe(params => {
			if(this.router.getCurrentNavigation().extras.state) {
				this.product = this.router.getCurrentNavigation().extras.state.product;
				this.product_price_id = this.product.price.product_price_id;
			}
		});
	}

  	ngOnInit() {
		  
  	}

	SelectProductPrice(product_price) {
		this.product.price = product_price;
	}

}
