import { Producto } from "./productos.model";

export interface CartModelServer{
total: number;
data: [{
    producto?: Producto,
    nunInCart: number
}];
}

export interface CartModelPublic{
total: number;
prodData: [{
    id: number,
    incart: number
}];
}