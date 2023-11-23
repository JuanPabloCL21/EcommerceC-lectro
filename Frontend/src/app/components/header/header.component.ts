import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CartModelServer } from 'src/app/models/cart.model';
import { CartService } from 'src/app/services/cart.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit{

  email = "clectrosrv@gmail.com";

  cartData: CartModelServer;
  cartTotal: number;

  constructor(public cartService: CartService, private router : Router){
    
  }

  ngOnInit(){
    
    this.cartService.cartTotal$.subscribe(total => {
      this.cartTotal = total;
    });
  
    this.cartService.cartData$.subscribe(data => this.cartData = data);

  }

  irACategoria(categoria: string): void {
    this.router.navigate(['/categoria', categoria]).then();
  }

 

}
