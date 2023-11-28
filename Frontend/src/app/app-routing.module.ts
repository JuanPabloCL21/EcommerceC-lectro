import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { ProductComponent } from './components/product/product.component';
import { CartComponent } from './components/cart/cart.component';
import { CheckoutComponent } from './components/checkout/checkout.component';
import { ThankyouComponent } from './components/thankyou/thankyou.component';
import { CategoryComponent } from './components/category/category.component';
import { LoginComponent } from './components/login/login.component';
import { ProfileComponent } from './components/profile/profile.component';
import { profileGuard } from './guard/profile.guard';
import { RegisterComponent } from './components/register/register.component';

const routes: Routes = [
  {
    path: '',
    component: HomeComponent,
  },

  {
    path: 'producto/:id',
    component: ProductComponent,
  },

  {
    path: 'carrito',
    component: CartComponent,
  },

  {
    path: 'pago',
    component: CheckoutComponent,
  },

  {
    path: 'gracias',
    component: ThankyouComponent,
  },

  {
    path: 'categoria/:categoria',
    component: CategoryComponent
  },
  {
    path: 'login', 
    component: LoginComponent
  },
  {
    path: 'profile',
    component: ProfileComponent,
    canActivate: [profileGuard]
  },
  {
    path: 'register', 
    component: RegisterComponent
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
