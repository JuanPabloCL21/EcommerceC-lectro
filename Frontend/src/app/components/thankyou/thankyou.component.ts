import { Component, OnInit } from '@angular/core';
import { Route, Router } from '@angular/router';
import { Producto } from 'src/app/models/productos.model';
import { OrderService } from 'src/app/services/order.service';

@Component({
  selector: 'app-thankyou',
  templateUrl: './thankyou.component.html',
  styleUrls: ['./thankyou.component.scss']
})
export class ThankyouComponent implements OnInit {

  message: string;
  orden_id: number;
  productos;
  cartTotal;
  constructor(private router: Router,
              private orderService: OrderService) {
    const navigation = this.router.getCurrentNavigation();
    const state = navigation?.extras.state as {
      message: string,
      productos: ProductResponseModel[],
      orden_id: number,
      total: number
    };

    this.message = state.message;
    this.orden_id = state.orden_id;
    this.productos = state.productos;
    this.cartTotal = state.total;
    console.log(this.productos);
  }

  ngOnInit() {

  }
}

interface ProductResponseModel {
  id: number;
  nombre: string;
  descripcion: string;
  precio: number;
  cantidadOrdenanda: number;
  imagen: string;
}
