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

   getSingleOrder(orderId: number){
    return this.http.get<ProductResponseModel[]>(this.SERVER_URL + '/ordenes' + orderId).toPromise();
   }
}

interface ProductResponseModel{
  id: number,
  titulo: string,
  descripcion: string,
  precio: number,
  cantidadOrdenada: number,
  imagen: string;
}
