export interface ProductoModelServer {
    id: Number;
    nombre: String;
    descripcion: String;
    imagen: String;
    precio: Number;
    cantidad: Number;
    imagenes: String;
}

export interface serverResponse{
    count: Number;
    Products: ProductoModelServer[]
};