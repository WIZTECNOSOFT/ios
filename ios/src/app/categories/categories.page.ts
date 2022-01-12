import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, NavigationExtras} from '@angular/router';

import { LoadingService } from '../../services/loading.service';
import { ApiService } from '../../services/api.service';

@Component({
  selector: 'app-categories',
  templateUrl: './categories.page.html',
  styleUrls: ['./categories.page.scss'],
})
export class CategoriesPage implements OnInit {

	categories:any;
	fakes = [1,2,3,4,5,6,7,8,9,10];
	errors:any;

	constructor(
		public loading : LoadingService,
		public api : ApiService,
		private route: ActivatedRoute,
		public router: Router,
	) { 
		
	}

  	ngOnInit() {
		this.getCategories();
  	}

	async getCategories() {
		await this.api.httpCall('categories',{},'')
		.then((response) => {
			this.categories = response['data'];
        },
        (error) => {
			this.errors = error.error.errors;
        });
	}

	openSubCategories(category) {
		let navigationExtras: NavigationExtras = {
			state: {
				category: category,
			}
		};
		this.router.navigate(['/sub-categories'],navigationExtras);
	}

}
