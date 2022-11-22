import express from "express";
const { Router } = express;
import {carritosDao,productosDao} from "../daos/index.js";
import multer from "multer";

let routesCarrito = new Router();



const elapsed = Date.now();
const hoy = new Date(elapsed)
const diaHoy= hoy.toLocaleDateString()

routesCarrito.post("/", (req, res) => {
  if (req.query.admin) {
    let newCarrito = {
      time: diaHoy,
      productos : [],
    };
    let idCarritoAgregado = carritosDao.save(newCarrito);
    alert(`se guardo el carrito con id numero ${idCarritoAgregado}`)
    res.render("cart");
  } else {
    res.send("error no esta autorizado apra acceder");
  }
});

routesCarrito.delete("/:id", async (req, res) => {
  let data = await productosDao.deleteById(req.params.id);
  res.json(data);
  //res.send(productos);
});

routesCarrito.get("/", async (req, res) => {
  let data = await carritosDao.getAll();
  res.render("cart", { data: data });
});

routesCarrito.get("/:id/productos", async (req, res) => {
  let data = await carritosDao.getAll();
  res.render("cart", { data: data });
});

let storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads");
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  },
});

let upload = multer({ storage });

routesCarrito.get("/form",(req,res)=>{
  res.render("form")
})

//************/
/************/
/* SUMAR ARTICULOS AL CARRITO */

routesCarrito.post("/:id/productos/:idCarrito", (req, res) => {
  let data = productosDao.getAll();
  res.render("index", { data: data });
  let objSelect= data.find(x=>{
    return x.id === req.params.id
  })

  let carro = carritosDao.getAll
  let carSelect= carro.find(x=>{
    return x.id === req.params.id
  })
  carSelect.productos.push(objSelect)
  
  carritosDao.save(carSelect)

});

//************/
/************/
/* ELIMINAR ARTICULOS DEL CARRITO */

routesCarrito.delete("/:id/productos/:id_prod", async (req, res) => {
  let carro = carritosDao.getAll
  let carSelect= carro.find(x=>{
    return x.id === req.params.id
  })

  let newProductCarro = carSelect.productos.filter(el=> el.id !==id)
  carSelect.productos = newProductCarro
  carritosDao.save(carSelect);
  
});




export default routesCarrito;
