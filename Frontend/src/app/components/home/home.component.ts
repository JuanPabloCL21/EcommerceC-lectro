import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { ProductService } from 'src/app/services/product.service';
import { Producto, serverResponse } from 'src/app/models/productos.model';


@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit{
  
  productos: Producto[] = [];

  constructor(private productServices: ProductService){

  }



  ngOnInit(): void {
    
   
    this.cargarProductos();
    
  }

  cargarProductos(): void {
    this.productServices.getAllProducts().subscribe((prods: serverResponse) => {
      this.productos = prods.productos;
      console.log(this.productos);
    })
  }

}



