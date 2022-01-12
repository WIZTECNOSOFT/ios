import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-welcome',
  templateUrl: './welcome.page.html',
  styleUrls: ['./welcome.page.scss'],
})
export class WelcomePage implements OnInit {

  constructor(private router : Router) { }

  ngOnInit() {
  }

  goToAccount(){
    this.router.navigateByUrl('/tabs/account');
  }

  goToCart(){
    this.router.navigateByUrl('/tabs/cart'); 
  }

  goToCategories(){
    this.router.navigateByUrl('/tabs/categories'); 
  }

  goToHome(){
    this.router.navigateByUrl('/home'); 
  }

  goToMyShelf(){
    this.router.navigateByUrl('/my-shelf'); 
  }

  goToOtp(){
    this.router.navigateByUrl('/otp'); 
  }

  goToPaymentMethods(){
    this.router.navigateByUrl('/payment-methods'); 
  }

  goToProduct(){
    this.router.navigateByUrl('/product'); 
  }

  goToProducts(){
    this.router.navigateByUrl('/products'); 
  }

  goToRegister(){
    this.router.navigateByUrl('/register'); 
  }

  goToSearch(){
    this.router.navigateByUrl('/tabs/search'); 
  }

  goToShippingMethods(){
    this.router.navigateByUrl('/shipping-methods'); 
  }

  goToSubCategories(){
    this.router.navigateByUrl('/sub-categories');
  }
}
