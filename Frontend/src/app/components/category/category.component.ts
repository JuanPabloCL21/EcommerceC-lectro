import { Component, OnInit } from '@angular/core';
import { ProductService } from 'src/app/services/product.service';
import { Producto, serverResponse} from 'src/app/models/productos.model';
import { ActivatedRoute, Router} from '@angular/router';
import { CartService } from 'src/app/services/cart.service';


@Component({
  selector: 'app-category',
  templateUrl: './category.component.html',
  styleUrls: ['./category.component.scss']
})
export class CategoryComponent implements OnInit{

  productosDeCategoria: Producto[] = [];
  cantidadTotal: Number = 0;
  categoria: string;

  constructor(private productService: ProductService, 
    private route: ActivatedRoute, 
    private router: Router,
    private cartService : CartService){

  }

  ngOnInit(): void {

    this.route.params.subscribe(params => {
      this.categoria = params['categoria'];
      this.getProductosPorCategoria(this.categoria);
    });
  }


  getProductosPorCategoria(categoria: string): void {
    this.productService.getProductsFromCategory(categoria)
      .subscribe(response => {
        this.productosDeCategoria = response.productos;
        this.cantidadTotal = response.count;

        console.log(response.productos);
      });
  }

  selectProduct(id: Number) {
    this.router.navigate(['/producto', id]).then;
  }

  AddToCart(id:number){
    this.cartService.AddProductToCart(id);
  }

}
