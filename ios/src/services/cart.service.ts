import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage';

@Injectable({
  	providedIn: 'root'
})
export class CartService {

	cartProducts = [];

	constructor(
		private storage: Storage,
	){
		this.storage.get('cartProducts').then((data) => {
			if(data!=null) {
				this.cartProducts = data;
			}
		});
	}

	addToCart(product,price) {
		let newProduct = {
			product_id:product.product_id,
			product_code:product.product_code,
			product_name:product.product_name,
			category_name:product.category.category_name,
			product_type:product.product_type,
			unit_name:price.unit.unit_name,
			hsn_code:product.hsn_code,
			is_feature:product.is_feature,
			is_flash_sale:product.is_flash_sale,
			start_date:product.start_date,
			end_date:product.end_date,
			product_price_id:price.product_price_id,
			unit_id:price.unit_id,
			price:price.price,
			product_price:price,
			quantity:product.quantity,
			amount:price.price,
			tax_id:price.tax_id,
			tax_amount:price.tax_amount,
			discount:price.discount,
			discount_amount:price.discount_amount,
			mrp:price.mrp,
			selling_price:price.selling_price,
			sub_total:price.selling_price,
			savings:price.savings,
			image:product.image,
		}
		this.cartProducts.push(newProduct);
		this.storage.set('cartProducts', this.cartProducts);
	}

	removeFromCart(price) {
		let oldProduct = this.cartProducts.find( ({ product_price_id }) => product_price_id === price.product_price_id );
		let index = this.cartProducts.indexOf(oldProduct);
		this.cartProducts.splice(index, 1);
		this.storage.set('cartProducts', this.cartProducts);
	}

	addQuantity(price) {
		let oldProduct = this.cartProducts.find( ({ product_price_id }) => product_price_id === price.product_price_id );
		oldProduct.quantity++
		oldProduct.amount = oldProduct.quantity * price.price;
		oldProduct.tax_amount = oldProduct.quantity * price.tax_amount;
		oldProduct.discount_amount = oldProduct.quantity * price.discount_amount;
		oldProduct.sub_total = oldProduct.quantity * price.selling_price;
		oldProduct.savings = oldProduct.quantity * price.savings;
		this.storage.set('cartProducts', this.cartProducts);
	}

	removeQuantity(price) {
		if(this.quantity(price)==1) {
			this.removeFromCart(price);
		}
		else {
			let oldProduct = this.cartProducts.find( ({ product_price_id }) => product_price_id === price.product_price_id );
			oldProduct.quantity--
			oldProduct.amount = oldProduct.quantity * price.price;
			oldProduct.tax_amount = oldProduct.quantity * price.tax_amount;
			oldProduct.discount_amount = oldProduct.quantity * price.discount_amount;
			oldProduct.sub_total = oldProduct.quantity * price.selling_price;
			oldProduct.savings = oldProduct.quantity * price.savings;
			this.storage.set('cartProducts', this.cartProducts);
		}
	}

	emptyCart() {
		this.cartProducts = [];
		this.storage.set('cartProducts', this.cartProducts);
	}

	quantity(price) {
		let oldProduct = this.cartProducts.find( ({ product_price_id }) => product_price_id === price.product_price_id );
		if(oldProduct) {
			return oldProduct.quantity;
		}
		else {
			return 1;
		}
	}

	findItem(price) {
		return this.cartProducts.find( ({ product_price_id }) => product_price_id === price.product_price_id );
	}

	cartItems() {
		if(this.cartProducts?.length!=0) {
			let sum: number = this.cartProducts.map(a => a.quantity).reduce(function(a, b)
			{
				return a + b;
			});
			return sum;
		}
		else {
			return 0;
		}
	}

	subTotal() {
		if(this.cartProducts?.length!=0) {
			let sum: number = this.cartProducts.map(a => a.amount).reduce(function(a, b)
			{
				return a + b;
			});
			return (sum*1).toFixed(2);
		}
		else {
			return 0.00;
		}
	}

	taxAmount() {
		if(this.cartProducts?.length!=0) {
			let sum: number = this.cartProducts.map(a => a.tax_amount).reduce(function(a, b)
			{
				return a + b;
			});
			return (sum*1).toFixed(2);
		}
		else {
			return 0.00;
		}
	}

	discountAmount() {
		if(this.cartProducts?.length!=0) {
			let sum: number = this.cartProducts.map(a => a.discount_amount).reduce(function(a, b)
			{
				return a + b;
			});
			return (sum*1).toFixed(2);
		}
		else {
			return 0.00;
		}
	}

	cartValue() {
		if(this.cartProducts?.length!=0) {
			let sum: number = this.cartProducts.map(a => a.sub_total).reduce(function(a, b)
			{
				return a + b;
			});
			return (sum*1).toFixed(2);
		}
		else {
			return 0.00;
		}
	}

	savings() {
		if(this.cartProducts?.length!=0) {
			let sum: number = this.cartProducts.map(a => a.savings).reduce(function(a, b)
			{
				return a + b;
			});
			return (sum*1).toFixed(2);
		}
		else {
			return 0.00;
		}
	}
}
