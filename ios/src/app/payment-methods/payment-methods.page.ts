import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, NavigationExtras} from '@angular/router';
import { NavController } from '@ionic/angular';

import { LoadingService } from '../../services/loading.service';
import { ApiService } from '../../services/api.service';
import { AuthService } from '../../services/auth.service';
import { CartService } from '../../services/cart.service';

export declare var RazorpayCheckout:any;

@Component({
  selector: 'app-payment-methods',
  templateUrl: './payment-methods.page.html',
  styleUrls: ['./payment-methods.page.scss'],
})
export class PaymentMethodsPage implements OnInit {

	payment_methods: any;
	errors:any;
	order_id:'';
	user:any;
	order = {
		order_source:'App',
		user_id:'',
		address_id:'',
		address:'',
		shipping_method_id:'',
		shipping_method:null,
		delivery_date:'',
		slab_id:'',
		slab:null,
		shipping_slab_id:'',
		shipping_slab:null,
		payment_method_id:'',
		payment_method:null,
		sub_total:this.cart.subTotal(),
		tax_amount:this.cart.taxAmount(),
		discount_amount:this.cart.discountAmount(),
		total_amount:this.cart.cartValue(),
		shipping_amount:0,
		grand_total:0,
		order_products:this.cart.cartProducts,
		razorpay_payment_id:'',
		razorpay_order_id:'',
		razorpay_signature:''
	}

	constructor(
		private route: ActivatedRoute,
		public router: Router,
		public loading : LoadingService,
		public api : ApiService,
		public auth : AuthService,
		public cart : CartService,
		private navCtrl:NavController,
	) {
		this.route.queryParams.subscribe(params => {
			if(this.router.getCurrentNavigation().extras.state) {
				let order = this.router.getCurrentNavigation().extras.state.order;
				this.order.user_id = order.user_id;
				this.order.address_id = order.address_id;
				this.order.address = order.address.address;
				this.order.shipping_method_id = order.shipping_method_id;
				this.order.shipping_method = order.shipping_method;
				this.order.delivery_date = order.delivery_date;
				this.order.slab_id = order.slab_id;
				this.order.slab = order.slab;
				this.order.shipping_slab_id = order.shipping_slab_id;
				this.order.shipping_slab = order.shipping_slab;
				this.order.shipping_amount = Number((this.order.shipping_method.shipping_amount).toFixed(2));
				this.order.grand_total = Number((+this.order.shipping_amount + +this.order.total_amount).toFixed(2));
			}
		});
	}

	ngOnInit() {
		this.getPaymentMethods();
	}

	ionViewWillEnter() {
		if(this.auth.authenticated){
			this.user = this.auth.user;
		}
	}

	async getPaymentMethods() {
		await this.loading.open();
		await this.api.httpCall('getPaymentMethods',this.order,'')
		.then((response) => {
			this.loading.close();
			this.payment_methods = response['data'];
        },
        (error) => {
			this.loading.close();
			this.errors = error.error.errors;
        });
	}

	selectPaymentMethod(payment_method) {
		this.order.payment_method = payment_method;
	}

	checkOrder() {
		if(this.order.payment_method_id=='') {
			this.loading.presentAlert('Message','Please select payment method to continue..!')
		}
		else {
			if(this.order.payment_method.key_id==null || this.order.payment_method.key_id=='') {
				this.placeOrder();
			}
			else {
			//	this.placeOrder();
			 this.createOrder();
			}
		}
	}

	async createOrder() {
		await this.loading.open();
		await this.api.httpCall('createOrder',this.order,'')
		.then((response) => {
			this.loading.close();
			this.order_id = response['data'];
			 this.payWithRazorpay();
        },
        (error) => {
			this.loading.close();
			this.errors = error.error.errors;
        });
	}

 payWithRazorpay() {
 	var options = {
 	  	description: 'Order Payment',
 image: 'assets/image/round_logo.png',
	  	currency: "INR", 
 	  	key: this.order.payment_method.key_id, 
 	  	amount: (100 * this.order.grand_total),
 	  	name: this.user.name,
 	  	prefill: {
 			email: this.user.email,
 			contact: this.user.mobile_no,
 			name: this.user.name
 	  	},
 	  	theme: {
 			color: '#34088f'
 	  	},
 	  	modal: {
 			ondismiss: function () {
 		  		alert('dismissed')
 			}
 	  	}
 	};
 	let vm = this;
 	var successCallback = function(success) {
 		vm.order.razorpay_payment_id = success.razorpay_payment_id;
 		vm.order.razorpay_order_id = success.razorpay_order_id;
 		vm.order.razorpay_signature = success.razorpay_signature;
 		vm.placeOrder()
 	}
 	var cancelCallback = function(error) {
 		alert(error.description)
 	}
	RazorpayCheckout.on('payment.success', successCallback)
 	RazorpayCheckout.on('payment.cancel', cancelCallback)
 	RazorpayCheckout.open(options)
	 }

	async placeOrder() {
		await this.loading.open();
		await this.api.httpCall('placeOrder',this.order,'')
		.then((response) => {
			this.loading.close();
			let order = response['data'];
			this.loading.presentAlert('Success','Thank you for placing order with Heritage Shelf, your order number is : '+order.order_no);
			this.navCtrl.navigateRoot('/tabs/home');
			this.cart.emptyCart();
        },
        (error) => {
			this.loading.close();
			this.errors = error.error.errors;
        });
	}

}
