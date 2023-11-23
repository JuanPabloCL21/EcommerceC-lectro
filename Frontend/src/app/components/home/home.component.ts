import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { ProductService } from 'src/app/services/product.service';
import { Producto, serverResponse } from 'src/app/models/productos.model';
import { Router } from '@angular/router';
import { CartService } from 'src/app/services/cart.service';


@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit{
  
  productos: Producto[] = [];

  constructor(private productServices: ProductService, private cartService: CartService, private router: Router){

  }



  ngOnInit(): void {
    
   
    this.cargarProductos();
    
  }

  cargarProductos(): void {
    this.productServices.getAllProducts(8).subscribe((prods: serverResponse) => {
      this.productos = prods.productos;
      console.log(this.productos);
    })
  }

  selectProduct(id: Number) {
    this.router.navigate(['/producto', id]).then;
  }

  AddToCart(id:number){
    this.cartService.AddProductToCart(id);
  }

  irACategoria(categoria: string): void {
    this.router.navigate(['/categoria', categoria]).then();
  }

}



