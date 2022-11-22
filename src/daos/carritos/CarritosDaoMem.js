 import ContenedorMemoria from "../../contenedores/ContenedorArchivo.js"

class CarritosDaoMem extends ContenedorMemoria {

    async guardar(carrito = { productos: [] }) {
        return super.guardar(carrito)
    }
}

export default CarritosDaoMem
 