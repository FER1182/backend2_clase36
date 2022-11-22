import express from "express";
const { Router } = express;
import cookieParser from "cookie-parser";
import routesProductos from "./routesProductos.js";
import carritoRoutes from "./routesCarrito.js";
import {productosDao} from "../../src/daos/index.js";
import multer from "multer";



let routesLogin = new Router();

routesLogin.use(cookieParser());
routesLogin.use(express.json())
routesLogin.use(express.urlencoded({ extended: false }));
routesLogin.use("/productos",routesProductos);
routesLogin.use("/cart",carritoRoutes);

const elapsed = Date.now();
const hoy = new Date(elapsed)
const diaHoy= hoy.toLocaleDateString()


let storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads");
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  },
});

let upload = multer({ storage });

routesLogin.get("/form", (req, res) => {
    res.render("form");
});
routesLogin.post("/form", upload.single("myfile"), (req, res) => {
  console.log("estos es el form")
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

routesLogin.get("/", (req, res) => {
  // loggerTodos.info(`metodo ${req.method} Ruta  ${req.originalUrl}`);
  if (req.session.nombre) {
    res.redirect("/productos");
  } else {
    res.redirect("/login");
  }
});

routesLogin.get("/login", (req, res) => {
  res.render("login");
});
routesLogin.get("/login-error", (req, res) => {
  res.render("login-error");
});

routesLogin.get("/register", (req, res) => {
  loggerWarn.warn(`metodo ${req.method} Ruta  ${req.originalUrl}`);
  res.render("register");
});

routesLogin.get("*", (req, res) => {
  const html = `<div> direccion no valida </div>`;
  res.status(404).send(html);
});
/*============================[Para hacer andar el login]============================*/
routesLogin.post("/register", (req, res) => {
  const { email, password, direccion } = req.body;
  console.log(req.body);
  const newUsuario = usuariosDB.find((usuario) => usuario.nombre == email);
  if (newUsuario) {
    res.render("register-error");
  } else {
    usuariosDB.push({ email, password, direccion });
    console.log(usuariosDB);
    res.redirect("/login");
  }
});

routesLogin.post("/login", (req, res) => {
  const { email, password } = req.body;
  console.log(req.body)
  console.log(email)  
  if (email !== "fer@gmail.com" || password !== "1234") {
    return res.render("login-error");
  }
  req.session.email = email;
  req.session.contador = 0;
  res.redirect("/productos");
});

export default routesLogin;
