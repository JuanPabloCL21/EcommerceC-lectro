import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { ProductComponent } from './components/product/product.component';
import { CartComponent } from './components/cart/cart.component';
import { CheckoutComponent } from './components/checkout/checkout.component';
import { ThankyouComponent } from './components/thankyou/thankyou.component';

const routes: Routes = [
  {
    path: '', component: HomeComponent
  },

  {
    path: 'producto/:id', component: ProductComponent
  },

  {
    path: 'carrito', component: CartComponent
  },

  {
    path: 'checkout', component: CheckoutComponent
  },
  
  {
    path: 'gracias', component:ThankyouComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
