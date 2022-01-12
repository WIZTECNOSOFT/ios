import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, NavigationExtras} from '@angular/router';

@Component({
  selector: 'app-pages',
  templateUrl: './pages.page.html',
  styleUrls: ['./pages.page.scss'],
})
export class PagesPage implements OnInit {

	page:any;

	constructor(
		private route: ActivatedRoute,
		public router: Router,
	) { 
		this.route.queryParams.subscribe(params => {
			if(this.router.getCurrentNavigation().extras.state) {
				this.page = this.router.getCurrentNavigation().extras.state.page;
			}
		});
	}


  	ngOnInit() {
  	}

}
