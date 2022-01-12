import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
	{
		path: '',
		loadChildren: () => import('./tabs/tabs.module').then(m => m.TabsPageModule)
	},
	{
		path: 'welcome',
		loadChildren: () => import('./welcome/welcome.module').then(m => m.WelcomePageModule)
	},
	{
		path: 'login',
		loadChildren: () => import('./login/login.module').then(m => m.LoginPageModule)
	},
	{
		path: 'register',
		loadChildren: () => import('./register/register.module').then(m => m.RegisterPageModule)
	},
	{
		path: 'otp',
		loadChildren: () => import('./otp/otp.module').then(m => m.OtpPageModule)
	},
	{
		path: 'sub-categories',
		loadChildren: () => import('./sub-categories/sub-categories.module').then(m => m.SubCategoriesPageModule)
	},
	{
		path: 'products',
		loadChildren: () => import('./products/products.module').then(m => m.ProductsPageModule)
	},
	{
		path: 'product',
		loadChildren: () => import('./product/product.module').then(m => m.ProductPageModule)
	},
	{
		path: 'payment-methods',
		loadChildren: () => import('./payment-methods/payment-methods.module').then(m => m.PaymentMethodsPageModule)
	},
	{
		path: 'shipping-methods',
		loadChildren: () => import('./Shipping-methods/Shipping-methods.module').then(m => m.ShippingMethodsPageModule)
	},
	{
		path: 'addresses',
		loadChildren: () => import('./addresses/addresses.module').then( m => m.AddressesPageModule)
	},
	{
		path: 'address',
		loadChildren: () => import('./address/address.module').then( m => m.AddressPageModule)
	},
	{
		path: 'map',
		loadChildren: () => import('./map/map.module').then( m => m.MapPageModule)
	},
	{
		path: 'orders',
		loadChildren: () => import('./orders/orders.module').then( m => m.OrdersPageModule)
	},
	{
		path: 'order',
		loadChildren: () => import('./order/order.module').then( m => m.OrderPageModule)
	},
	{
		path: 'profile',
		loadChildren: () => import('./profile/profile.module').then( m => m.ProfilePageModule)
	},
	{
		path: 'pages',
		loadChildren: () => import('./pages/pages.module').then( m => m.PagesPageModule)
	},
	{
		path: 'update',
		loadChildren: () => import('./update/update.module').then( m => m.UpdatePageModule)
	},
  {
    path: 'username',
    loadChildren: () => import('./username/username.module').then( m => m.UsernamePageModule)
  }

];
@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {}
