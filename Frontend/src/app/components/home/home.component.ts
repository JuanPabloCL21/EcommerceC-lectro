import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { ProductoModelServer, serverResponse } from 'src/app/models/productos.model';
import { ProductService } from 'src/app/services/product.service';


@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit{
  
  products: ProductoModelServer[] = [];

  constructor(private productServices: ProductService){

  }



  ngOnInit(): void {
    
    this.productServices.getAllProducts(3).subscribe((prods: serverResponse ) =>{
      this.products = prods.Products;
      console.log(this.products.toString);
    })
    
    
  }
}
