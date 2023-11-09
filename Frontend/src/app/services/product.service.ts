import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { serverResponse } from '../models/productos.model';

@Injectable({
  providedIn: 'root'
})
export class ProductService {

  private SERVER_URL = "http://localhost:3000/api/";

  constructor(private http: HttpClient) { }

  /*Esto es para recuperar todos los productos del backend*/

  

 getAllProducts(numberOfResults = 1): Observable<serverResponse>{

    return this.http.get<serverResponse>(this.SERVER_URL + 'productos', {
      params: {
        limit: numberOfResults.toString()
      }
    });

  }
}
