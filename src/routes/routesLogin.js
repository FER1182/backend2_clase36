import express from "express";
const { Router } = express;
import cookieParser from "cookie-parser";
import routesProductos from "./routesProductos.js";
import carritoRoutes from "./routesCarrito.js";
import {productosDao} from "../../src/daos/index.js";
import multer from "multer";
import passport from "passport";
import { Strategy } from "passport-local";
import session from "express-session";
import User from "../../src/models/User.js";
import bcrypt from "bcrypt";

let routesLogin = new Router();

routesLogin.use(cookieParser());
routesLogin.use(express.json())
routesLogin.use(express.urlencoded({ extended: false }));
routesLogin.use("/productos",routesProductos);
routesLogin.use("/cart",carritoRoutes);

const elapsed = Date.now();
const hoy = new Date(elapsed)
const diaHoy= hoy.toLocaleDateString()

const app = express();
const LocalStrategy = Strategy;

/*============================[Middlewares]============================*/

/*----------- Session -----------*/
app.use(cookieParser());
app.use(
  session({
    secret: "1234567890!@#$%^&*()",
    resave: false,
    saveUninitialized: false,
    cookie: {
      maxAge: 20000, //20 seg
    },
  })
);
app.use(passport.initialize());
app.use(passport.session());

passport.use(
  new LocalStrategy((email, password, done) => {
   

     User.findOne({ email }, (err, user) => {
     console.log("dentro del local")
      if (err) console.log(err);
      if (!user) return done(null, false);
      bcrypt.compare(password, user.password, (err, isMatch) => {
        console.log(user);
        if (err) console.log(err);
        if (isMatch) return done(null, user);
        return done(null, false);
      });
    }); 
  })
);

passport.serializeUser((user, done) => {
  done(null, user._id);
});

passport.deserializeUser(async (id, done) => {
  const user = await User.findById(id);
  return done(null, user);
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

routesLogin.get("/form", (req, res) => {
    res.render("form");
});

routesLogin.post(
  "/login",
  passport.authenticate("local", {
    failureRedirect: "login-error",
  }),
  (req, res) => {
    loggerTodos.info(`metodo ${req.method} Ruta  ${req.originalUrl} `);
    console.log("no entrac")
    res.redirect("/datos");
  }
); 

 routesLogin.post("/register", (req, res) => {
  const { email, password, nombre, direccion, edad, telefono, foto } = req.body;
  User.findOne({ email }, async (err, user) => {
    if (err) console.log(err);
    if (user) res.render("register-error");
    if (!user) {
      const hashedPassword = await bcrypt.hash(password, 8);
      const newUser = new User({
        email,
        password: hashedPassword,
        nombre,
        direccion,
        edad,
        telefono,
        foto,
      });
      await newUser.save();
      res.redirect("/login");
    }
  });
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
  //loggerWarn.warn(`metodo ${req.method} Ruta  ${req.originalUrl}`);
  res.render("register");
});

routesLogin.get("*", (req, res) => {
  const html = `<div> direccion no valida </div>`;
  res.status(404).send(html);
});
/*============================[Para hacer andar el login]============================*/
/* routesLogin.post("/register", (req, res) => {
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
}); */

/* routesLogin.post("/login", (req, res) => {
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
 */
export default routesLogin;
