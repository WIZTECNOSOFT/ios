import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, NavigationExtras} from '@angular/router';

import { LoadingService } from '../../services/loading.service';
import { ApiService } from '../../services/api.service';

@Component({
  selector: 'app-sub-categories',
  templateUrl: './sub-categories.page.html',
  styleUrls: ['./sub-categories.page.scss'],
})
export class SubCategoriesPage implements OnInit {
	
	category:any
	sub_categories:any;
	errors:any;
	fakes = [1,2,3,4,5,6,7,8,9,10];

	constructor(
		public loading : LoadingService,
		public api : ApiService,
		private route: ActivatedRoute,
		public router: Router,
	) { 
		this.route.queryParams.subscribe(params => {
			if(this.router.getCurrentNavigation().extras.state) {
				this.category = this.router.getCurrentNavigation().extras.state.category;
			}
		});
	}

  	ngOnInit() {
		this.getSubCategories();
  	}

	async getSubCategories() {
		await this.api.httpCall('subCategories',this.category,'')
		.then((response) => {
			this.sub_categories = response['data'];
        },
        (error) => {
			this.errors = error.error.errors;
        });
	}

	openProducts(sub_category) {
		let navigationExtras: NavigationExtras = {
			state: {
				sub_category: sub_category,
			}
		};
		this.router.navigate(['/products'],navigationExtras);
	}

	openCategoryProducts() {
		let navigationExtras: NavigationExtras = {
			state: {
				category: this.category,
			}
		};
		this.router.navigate(['/products'],navigationExtras);
	}
}
