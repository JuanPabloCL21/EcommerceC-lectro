import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CartModelServer } from 'src/app/models/cart.model';
import { CartService } from 'src/app/services/cart.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit{

  email = "clectrosrv@gmail.com";

  cartData: CartModelServer;
  cartTotal: number;
  authState: boolean;

  constructor(public cartService: CartService, private router : Router, public userService: UserService){
    
  }

  ngOnInit(){
    
    this.cartService.cartTotal$.subscribe(total => {
      this.cartTotal = total;
    });
  
    this.cartService.cartData$.subscribe(data => this.cartData = data);
    this.userService.authState$.subscribe(authState => this.authState = authState);

  }

  irACategoria(categoria: string): void {
    this.router.navigate(['/categoria', categoria]).then();
  }
  

 

}
