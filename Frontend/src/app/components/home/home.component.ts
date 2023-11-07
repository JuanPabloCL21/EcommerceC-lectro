import { Component, OnInit } from '@angular/core';
import { ProductService } from 'src/app/services/product.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit{
  
  products: any[] = [];

  constructor(private productServices: ProductService){

  }



  ngOnInit(): void {
    
    this.productServices.getAllProducts().subscribe((prods: ) => {
      this.products = prods.products;
      console.log(this.products);
    })
    
  }
}
