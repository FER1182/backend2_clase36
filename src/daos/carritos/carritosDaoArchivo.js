import ContenedorArchivo from "../../contenedores/ContenedorArchivo.js"

class CarritosDaoArchivo extends ContenedorArchivo {

    constructor() {
        super('carrito.json')
    }

    async guardar(carrito = { productos: [] }) {
        return super.guardar(carrito)
    }
}

export default CarritosDaoArchivo
