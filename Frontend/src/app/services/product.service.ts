import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { serverResponse } from '../models/productos.model';
import { Producto } from '../models/productos.model';

@Injectable({
  providedIn: 'root'
})
export class ProductService {

  private SERVER_URL = "http://localhost:6069/api/";

  constructor(private http: HttpClient) { }

  /*Esto es para recuperar todos los productos del backend*/

  getProductos(): Observable<Producto[]>{
    return this.http.get<Producto[]>(this.SERVER_URL + 'productos');
  }

 getAllProducts(numberOfResults = 10): Observable<serverResponse>{

    return this.http.get<serverResponse>(this.SERVER_URL + 'productos', {
      params: {
        limit: numberOfResults.toString()
      }
    });

  }
}
