import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, NavigationExtras} from '@angular/router';

import { LoadingService } from '../../services/loading.service';
import { ApiService } from '../../services/api.service';
import { CartService } from '../../services/cart.service';

@Component({
  selector: 'app-order',
  templateUrl: './order.page.html',
  styleUrls: ['./order.page.scss'],
})
export class OrderPage implements OnInit {

	order:any;

	constructor(
		public loading : LoadingService,
		public api : ApiService,
		public cart : CartService,
		private route: ActivatedRoute,
		public router: Router,
	) { 
		this.route.queryParams.subscribe(params => {
			if(this.router.getCurrentNavigation().extras.state) {
				this.order = this.router.getCurrentNavigation().extras.state.order;
			}
		});
	}

  	ngOnInit() {
		  
  	}

}
