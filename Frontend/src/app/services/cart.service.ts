import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ProductService } from './product.service';
import { OrderService } from './order.service';
import { CartModelPublic, CartModelServer } from '../models/cart.model';
import { BehaviorSubject } from 'rxjs';
import { NavigationExtras, Route, Router } from '@angular/router';
import { Producto } from '../models/productos.model';
import { ToastrService } from 'ngx-toastr';
import { NgxSpinnerService } from 'ngx-spinner';
import { JsonPipe } from '@angular/common';

@Injectable({
  providedIn: 'root',
})
export class CartService {
  SERVER_URL = 'http://localhost:6069/api/';

  private cartDataClient: CartModelPublic = {
    prodData: [
      {
        incart: 0,
        id: 0,
      },
    ],
    total: 0,
  };

  private cartDataServer: CartModelServer = {
    data: [
      {
        producto: undefined,
        nunInCart: 0,
      },
    ],
    total: 0,
  };

  cartTotal$ = new BehaviorSubject<number>(0);
  cartData$ = new BehaviorSubject<CartModelServer>(this.cartDataServer);

  constructor(
    private http: HttpClient,
    private productService: ProductService,
    private orderService: OrderService,
    private router: Router,
    private toast: ToastrService,
    private spinner: NgxSpinnerService
  ) {
    this.cartTotal$.next(this.cartDataServer.total);
    this.cartData$.next(this.cartDataServer);

    let info: CartModelPublic = JSON.parse(localStorage.getItem('cart')!);

    if (info !== null && info !== undefined && info.prodData[0].incart !== 0) {
      this.cartDataClient = info;

      this.cartDataClient.prodData.forEach((p) => {
        this.productService
          .getSingleProduct(p.id)
          .subscribe((actualProductInfo: Producto) => {
            if (this.cartDataServer.data[0].nunInCart == 0) {
              this.cartDataServer.data[0].nunInCart = p.incart;
              this.cartDataServer.data[0].producto = actualProductInfo;
              this.CalculateTotal();
              this.cartDataClient.total = this.cartDataServer.total;
              localStorage.setItem('cart', JSON.stringify(this.cartDataClient));
            } else {
              this.cartDataServer.data.push({
                nunInCart: p.incart,
                producto: actualProductInfo,
              });
              this.CalculateTotal();

              this.cartDataClient.total = this.cartDataServer.total;
              localStorage.setItem('cart', JSON.stringify(this.cartDataClient));
            }
            this.cartData$.next({ ...this.cartDataServer });
          });
      });
    }
  }

  AddProductToCart(id: number, cantidad?: number) {
    this.productService.getSingleProduct(id).subscribe((prod) => {
      if (this.cartDataServer.data[0].producto === undefined) {
        this.cartDataServer.data[0].producto = prod;
        this.cartDataServer.data[0].nunInCart =
          cantidad !== undefined ? cantidad : 1;
        this.CalculateTotal();
        this.cartDataClient.prodData[0].incart =
          this.cartDataServer.data[0].nunInCart;
        this.cartDataClient.prodData[0].id = prod.id;
        this.cartDataClient.total = this.cartDataServer.total;
        localStorage.setItem('cart', JSON.stringify(this.cartDataClient));
        this.cartData$.next({ ...this.cartDataServer });
        this.toast.success(
          `${prod.nombre} añadido al carrito`,
          'Producto Añadido',
          {
            timeOut: 1500,
            progressBar: true,
            progressAnimation: 'increasing',
            positionClass: 'toast-top-right',
          }
        );
      } else {
        const index = this.cartDataServer.data.findIndex(
          (p) => p.producto?.id == prod.id
        );

        if (index !== -1) {
          if (cantidad !== undefined && cantidad <= prod.cantidad) {
            this.cartDataServer.data[index].nunInCart =
              this.cartDataServer.data[index].nunInCart < prod.cantidad
                ? cantidad
                : prod.cantidad;
          } else {
            this.cartDataServer.data[index].nunInCart < prod.cantidad
              ? this.cartDataServer.data[index].nunInCart++
              : prod.cantidad;
          }

          this.cartDataClient.prodData[index].incart =
            this.cartDataServer.data[index].nunInCart;
          this.toast.info(
            `${prod.nombre} cantidad actualizada`,
            'Producto actualizado',
            {
              timeOut: 1500,
              progressBar: true,
              progressAnimation: 'increasing',
              positionClass: 'toast-top-right',
            }
          );
        } else {
          if (prod.cantidad !== 0) {
            this.cartDataServer.data.push({
              nunInCart: 1,
              producto: prod,
            });

            this.cartDataClient.prodData.push({
              incart: 1,
              id: prod.id,
            });

            this.toast.success(
              `${prod.nombre} añadido al carrito`,
              'Producto Añadido',
              {
                timeOut: 1500,
                progressBar: true,
                progressAnimation: 'increasing',
                positionClass: 'toast-top-right',
              }
            );
          }
        }
        this.CalculateTotal();
        this.cartDataClient.total = this.cartDataServer.total;
        localStorage.setItem('cart', JSON.stringify(this.cartDataClient));
        this.cartData$.next({ ...this.cartDataServer });
      }
    });
  }

  UpdateCartData(index: number, increase: Boolean) {
    let data = this.cartDataServer.data[index];
    if (increase) {
      // @ts-ignore
      data.nunInCart < data.producto?.cantidad
        ? data.nunInCart++
        : data.producto?.cantidad;
      this.cartDataClient.prodData[index].incart = data.nunInCart;
      this.CalculateTotal();
      this.cartDataClient.total = this.cartDataServer.total;
      this.cartData$.next({ ...this.cartDataServer });
      localStorage.setItem('cart', JSON.stringify(this.cartDataClient));
    } else {
      // @ts-ignore
      data.nunInCart--;

      // @ts-ignore
      if (data.nunInCart < 1) {
        this.DeleteProductFromCart(index);
        this.cartData$.next({ ...this.cartDataServer });
      } else {
        // @ts-ignore
        this.cartDataObs$.next({ ...this.cartDataServer });
        this.cartDataClient.prodData[index].incart = data.nunInCart;
        this.CalculateTotal();
        this.cartDataClient.total = this.cartDataServer.total;
        localStorage.setItem('cart', JSON.stringify(this.cartDataClient));
      }
    }
  }

  DeleteProductFromCart(index: number) {
    if (window.confirm('¿Estas Suguro que quieres eliminar el producto?')) {
      this.cartDataServer.data.splice(index, 1);
      this.cartDataClient.prodData.splice(index, 1);
      this.CalculateTotal();
      this.cartDataClient.total = this.cartDataServer.total;

      if (this.cartDataClient.total === 0) {
        this.cartDataClient = { prodData: [{ incart: 0, id: 0 }], total: 0 };
        localStorage.setItem('cart', JSON.stringify(this.cartDataClient));
      } else {
        localStorage.setItem('cart', JSON.stringify(this.cartDataClient));
      }

      if (this.cartDataServer.total === 0) {
        this.cartDataServer = {
          data: [
            {
              producto: undefined,
              nunInCart: 0,
            },
          ],
          total: 0,
        };
        this.cartData$.next({ ...this.cartDataServer });
      } else {
        this.cartData$.next({ ...this.cartDataServer });
      }
    } else {
      return;
    }
  }

  private CalculateTotal() {
    let Total = 0;

    this.cartDataServer.data.forEach((p) => {
      const { nunInCart } = p;
      const { precio } = p.producto!;

      // @ts-ignore
      Total += nunInCart * precio;
    });
    this.cartDataServer.total = Total;
    this.cartTotal$.next(this.cartDataServer.total);
  }

  CheckoutFromCart(userId: number) {

    this.http.post(`${this.SERVER_URL}ordenes/pago`, null).subscribe((res: any) => {
      

      if (res.success) {


        this.resetServerData();
        
        this.http.post(`${this.SERVER_URL}ordenes/new`, {
          user_id: userId,
          productos: this.cartDataClient.prodData
        }).subscribe((data: any) => {

          
          
          this.orderService.getSingleOrder(data.orden_id).then(prods => {
            if (data.success) {
              const navigationExtras: NavigationExtras = {
                state: {
                  message: data.message,
                  productos: prods,
                  orden_id: data.orden_id,
                  total: this.cartDataClient.total
                }
              };
              this.spinner.hide().then();
              this.router.navigate(['/gracias'], navigationExtras).then(p => {
                this.cartDataClient = {prodData: [{incart: 0, id: 0}], total: 0};
                this.cartTotal$.next(0);
                localStorage.setItem('cart', JSON.stringify(this.cartDataClient));
              });
            }
          });

        })
      } else {
        this.spinner.hide().then();
        this.router.navigateByUrl('/pago').then();
        this.toast.error(`Sorry, failed to book the order`, "Order Status", {
          timeOut: 1500,
          progressBar: true,
          progressAnimation: 'increasing',
          positionClass: 'toast-top-right'
        })
      }
    })
  }

  private resetServerData() {
    this.cartDataServer = {
      data: [
        {
          producto: undefined,
          nunInCart: 0,
        },
      ],
      total: 0,
    };
    this.cartData$.next({ ...this.cartDataServer });
  }

  CalculateSubTotal(index: number) {
    let subTotal = 0;

    const p = this.cartDataServer.data[index];

    //@ts-ignore
    subTotal = p.producto.precio * p.nunInCart;

    return subTotal;
  }
}

interface OrderConfirmationResponse {
  order_id: Number;
  success: Boolean;
  message: String;
  products: [{
    id: String,
    numInCart: String
  }]
}
