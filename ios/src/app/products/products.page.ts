import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, NavigationExtras} from '@angular/router';

import { LoadingService } from '../../services/loading.service';
import { ApiService } from '../../services/api.service';
import { CartService } from '../../services/cart.service';

@Component({
  selector: 'app-products',
  templateUrl: './products.page.html',
  styleUrls: ['./products.page.scss'],
})
export class ProductsPage implements OnInit {

	page=1;
	last_page=0;
	category:any
	sub_category:any
	filter = {
		search:'',
		category_id:'',
		sub_category_id:'',
	};
	products:any;
	errors:any;
	fakes = [0,1,2,3,4,5,6];

	constructor(
		public loading : LoadingService,
		public api : ApiService,
		public cart : CartService,
		private route: ActivatedRoute,
		public router: Router,
	) { 
		this.route.queryParams.subscribe(params => {
			if(this.router.getCurrentNavigation().extras.state) {
				if(this.router.getCurrentNavigation().extras.state.sub_category) {
					this.sub_category = this.router.getCurrentNavigation().extras.state.sub_category;
					this.filter.category_id = this.sub_category.parent_id;
					this.filter.sub_category_id = this.sub_category.category_id;
				}
				if(this.router.getCurrentNavigation().extras.state.category) {
					this.category = this.router.getCurrentNavigation().extras.state.category;
					this.filter.category_id = this.category.category_id;
					this.filter.sub_category_id = '';
				}
			}
		});
	}

	ionViewWillEnter() {
		this.page = 1;
		this.last_page = 0;
		this.getProducts();
	}

  	ngOnInit() {

  	}

	async getProducts() {
		let data = {
			category_id:this.filter.category_id,
			sub_category_id:this.filter.sub_category_id,
			page:this.page,
		};
		await this.api.httpCall('products',data,'')
		.then((response) => {
			this.products = response['data'];
			this.last_page = response['meta'].last_page;
        },
        (error) => {
			this.errors = error.error.errors;
        });
	}

	async loadMoreProducts(event) {
		this.page++;
		let data = {
			category_id:this.filter.category_id,
			sub_category_id:this.filter.sub_category_id,
			page:this.page,
		};
		await this.api.httpCall('products',data,'')
		.then((response) => {
			this.products = this.products.concat(response['data']);
			this.last_page = response['meta'].last_page;
			if(event) {
				event.target.complete();
			}
        },
        (error) => {
        	this.errors = error.error.error;
        });
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
