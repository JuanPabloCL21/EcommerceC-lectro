export interface Producto{
    id: number;
    nombre: string;
    descripcion: string;
    imagen: string;
    precio: number;
    cantidad: number;
    imagenes: string;

}

export interface serverResponse{
    count: Number;
    productos: Producto[]
};


