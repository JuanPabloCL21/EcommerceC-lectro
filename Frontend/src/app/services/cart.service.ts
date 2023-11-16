import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ProductService } from './product.service';
import { OrderService } from './order.service';
import { CartModelPublic, CartModelServer } from '../models/cart.model';
import { BehaviorSubject } from 'rxjs';
import { Route, Router } from '@angular/router';
import { Producto } from '../models/productos.model';
import { JsonPipe } from '@angular/common';

@Injectable({
  providedIn: 'root'
})
export class CartService {

  SERVER_URL = "http://localhost:6069/api/";

  private cartDataClient: CartModelPublic = {
    total: 0,
    prodData: [{
      incart: 0,
      id:0
    }]
  };

  private cartDataServer: CartModelServer = {
    total: 0,
    data: [{
      nunInCart: 0,
      producto: undefined
    }]
  };

  cartTotal$ = new BehaviorSubject<number>(0);
  cartData$ = new BehaviorSubject<CartModelServer>(this.cartDataServer);

  constructor(private http: HttpClient,
    private productService: ProductService,
    private orderService: OrderService,
    private router: Router) { 

      this.cartTotal$.next(this.cartDataServer.total);
      this.cartData$.next(this.cartDataServer);

      let info: CartModelPublic = JSON.parse(localStorage.getItem('cart') ||'{}');

      if (info != null && info != undefined && info.prodData[0].incart != 0){
        
        this.cartDataClient = info;

        this.cartDataClient.prodData.forEach(p => {
          this.productService.getSingleProduct(p.id).subscribe((actualProductInfo: Producto) =>{
            if (this.cartDataServer.data[0].nunInCart == 0){
              this.cartDataServer.data[0].nunInCart = p.incart;
              this.cartDataServer.data[0].producto = actualProductInfo;
              this.cartDataClient.total = this.cartDataServer.total;
              localStorage.setItem('cart', JSON.stringify(this.cartDataClient));
            } else {
              this.cartDataServer.data.push({
                nunInCart: p.incart,
                producto: actualProductInfo
              });

              this.cartDataClient.total = this.cartDataServer.total;
              localStorage.setItem('cart', JSON.stringify(this.cartDataClient));
            }
            this.cartData$.next({... this.cartDataServer});
          });
        });

}

    }

    AddProductToCart(id: number, cantidad?: number){
      this.productService.getSingleProduct(id).subscribe(prod => {
        if(this.cartDataServer.data[0].producto == undefined){
          this.cartDataServer.data[0].producto = prod;
          this.cartDataServer.data[0].nunInCart = cantidad != undefined ? cantidad : 1;
          
          this.cartDataClient.prodData[0].incart = this.cartDataServer.data[0].nunInCart;
          this.cartDataClient.prodData[0].id = prod.id;
          this.cartDataClient.total = this.cartDataServer.total;
          localStorage.setItem('cart', JSON.stringify(this.cartDataClient));
          this.cartData$.next({... this.cartDataServer});

        }
        else {
          let index = this.cartDataServer.data.findIndex(p => p.producto?.id == prod.id);

          if(index != -1){
            if ( cantidad != undefined && cantidad <= prod.cantidad){
              this.cartDataServer.data[index].nunInCart = this.cartDataServer.data[index].nunInCart < prod.cantidad ? cantidad : prod.cantidad;
            } else {
              this.cartDataServer.data[index].nunInCart = this.cartDataServer.data[index].nunInCart < prod.cantidad ? this.cartDataServer.data[index].nunInCart++ : prod.cantidad;
            }

            this.cartDataClient.prodData[index].incart = this.cartDataServer.data[index].nunInCart;
          }
          else{
            this.cartDataServer.data.push({
              nunInCart: 1,
              producto: prod
            });

            this.cartDataClient.prodData.push({
              incart: 1,
              id: prod.id
            });

            this.cartDataClient.total = this.cartDataServer.total;
            localStorage.setItem('cart', JSON.stringify(this.cartDataClient));
            this.cartData$.next({... this.cartDataServer});
          }
        }
      });
    }
}
