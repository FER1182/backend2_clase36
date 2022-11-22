import express from "express";
const { Router } = express;
import {productosDao} from "../../src/daos/index.js";
import multer from "multer";


let routesProductos = new Router();
let routesLogin = new Router();

const elapsed = Date.now();
const hoy = new Date(elapsed)
const diaHoy= hoy.toLocaleDateString()



/******************/
//a.get
routesProductos.get("/", async (req, res) => {
  let data = await productosDao.getAll();

  res.render("index", { data: data });
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

routesProductos.get("/form", (req, res) => {
  res.render("form");
});

/******************/
//b.post
routesLogin.post("/form", upload.single("myfile"), (req, res) => {
  
  req.query.admin = true
  if (req.query.admin) {
    let newProduct = {
      timestamp : diaHoy,
      name: req.body.name,
      description : req.body.description,
      codigo :req.body.codigo,
      urlFoto: req.body.urlFoto,
      price: req.body.price,               
      stock: req.body.stock,
    };
    let idProductoAgregado = productosDao.save(newProduct);
 
    console.log(`se guardo el producto ${idProductoAgregado}`)
    res.render("form");
  } else {
    res.send("error no esta autorizado apra acceder");
  }
});
/******************/
//get:/':id?

routesProductos.get("/productos/:id", async (req, res) => {
  let data = await productosDao.getById(req.params.id);
  res.json(data);
});

/******************/
//c.put

routesProductos.put("productos/:id", async (req, res) => {
  if (req.query.admin) {
    let newProduct = {
      name: req.body.name,
      price: req.body.price,
      img: req.body.img,
    };

    let data = await productosDao.putById(req.params.id, newProduct);
    res.json(data);
  } else {
    res.send("error no esta autorizado apra acceder");
  }
});

/******************/
//c.delete
routesProductos.delete("/productos/:id", async (req, res) => {
  if (req.query.admin) {
    let data = await productosDao.deleteById(req.params.id);
    res.json(data);
  } else {
    res.send("error no esta autorizado apra acceder");
  }
});

export default routesProductos
