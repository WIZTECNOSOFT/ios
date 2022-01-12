import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ShippingMethodsPage } from './shipping-methods.page';

const routes: Routes = [
  {
    path: '',
    component: ShippingMethodsPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ShippingMethodsPageRoutingModule {}
