import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ShippingMethodsPageRoutingModule } from './shipping-methods-routing.module';

import { ShippingMethodsPage } from './shipping-methods.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ShippingMethodsPageRoutingModule
  ],
  declarations: [ShippingMethodsPage]
})
export class ShippingMethodsPageModule {}
