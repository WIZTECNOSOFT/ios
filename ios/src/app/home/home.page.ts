import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, NavigationExtras} from '@angular/router';

import { LoadingService } from '../../services/loading.service';
import { ApiService } from '../../services/api.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage implements OnInit {

	sliderConfig = {
		slidesPerView: 1,
		spaceBetween: 0
	}

	sliders:any;
	dummy_sliders=[1,2,3];
	categories:any;
	dummy_categories=[1,2,3,4,5,6];
	errors:any;

  	constructor(
		public loading : LoadingService,
		public api : ApiService,
		private route: ActivatedRoute,
		public router: Router,
	) { 
		
	}

  	ngOnInit() {
		this.getSliders();
  	}

	async getSliders() {
		await this.api.httpCall('sliders',{'slider_type':'app'},'')
		.then((response) => {
			this.sliders = response['data'];
			this.getCategories()
        },
        (error) => {
			this.errors = error.error.errors;
        });
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
