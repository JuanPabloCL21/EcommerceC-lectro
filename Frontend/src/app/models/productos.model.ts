export interface Producto{
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
    productos: Producto[]
};


