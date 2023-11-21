import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class OrderService {

  productos : ProductResponseModel[] = [];
  SERVER_URL = "http://localhost:6069/api/";

  constructor(private http: HttpClient) {
   }

   getSingleOrder(orden_id: number){
    
    return this.http.get<ProductResponseModel[]>(this.SERVER_URL+ 'ordenes/'+ orden_id).toPromise();
   }
}

interface ProductResponseModel{
  id: number,
  nombre: string,
  descripcion: string,
  precio: number,
  imagen: string,
  cantidadOrdenanda: number
  
}
