/*============================[Modulos]============================*/
import express from "express";
import cookieParser from "cookie-parser";
import session from "express-session";
import path from "path";
import User from "./src/models/User.js";
import bcrypt from "bcrypt";
import passport from "passport";
import { Strategy } from "passport-local";
import "./src/db/config.js";
import { fork } from "child_process";
import minimist from "minimist";
import { clearScreenDown } from "readline";
import compression from "compression";
import log4js from "log4js";
import { emitWarning } from "process";
import routesProductos from "./src/routes/routesProductos.js";
import carritoRoutes from "./src/routes/routesCarrito.js";
import routesLogin from "./src/routes/routesLogin.js";


const LocalStrategy = Strategy;

const app = express();

app.use(compression());

/*============================[Base de datos]============================*/
const usuariosDB = [];

/*============================[logs]============================*/
log4js.configure({
  appenders: {
    miLoggerConsole: { type: "console" },
    miLoggerFile: { type: "file", filename: "warn.log" },
    miLoggerFile2: { type: "file", filename: "error.log" },
  },
  categories: {
    default: { appenders: ["miLoggerConsole"], level: "trace" },
    archivo: { appenders: ["miLoggerFile"], level: "warn" },
    archivo2: { appenders: ["miLoggerFile2"], level: "error" },
    todos: { appenders: ["miLoggerConsole", "miLoggerFile2"], level: "info" },
  },
});

const loggerWarn = log4js.getLogger("archivo");

const loggerError = log4js.getLogger("archivo2");

const loggerTodos = log4js.getLogger("todos");

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
    if (email == "pepe" && password == "1234")
      return done(null, { id: 1, nombre: "pepe" });

    done(null, false);

    /* User.findOne({ email }, (err, user) => {
      if (err) console.log(err);
      if (!user) return done(null, false);
      bcrypt.compare(password, user.password, (err, isMatch) => {
        console.log(user);
        if (err) console.log(err);
        if (isMatch) return done(null, user);
        return done(null, false);
      });
    }); */
  })
);

passport.serializeUser((user, done) => {
  done(null, user._id);
});

passport.deserializeUser(async (id, done) => {
  const user = await User.findById(id);
  return done(null, user);
});

app.set("view engine", "ejs");
app.set("views", "./src/views");

app.use("/",routesLogin);
app.use("/productos",routesProductos);
app.use("/cart",carritoRoutes);
 

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

/*============================[Rutas]============================*/



/* app.post(
  "/login",
  passport.authenticate("local", {
    failureRedirect: "login-error",
  }),
  (req, res) => {
    loggerTodos.info(`metodo ${req.method} Ruta  ${req.originalUrl} `);

    res.redirect("/datos");
  }
); */

/* app.post("/register", (req, res) => {
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
 */
app.get("/info", (req, res) => {
  let datos = {
    argumentos: minimist(process.argv.slice(2)),
    plataforma: process.platform,
    versionNode: process.version,
    memoriaReservada: process.memoryUsage(),
    ejecutable: process.execPath,
    pid: process.pid,
    carpetaProyecto: process.cwd(),
  };

  res.send(datos);
});





app.get("/logout", (req, res) => {
  req.session.destroy((err) => {
    res.redirect("/login");
  });
});


/*============================[Servidor]============================*/
//const options = { default: { port: 8080 } };
const PORT = 8080; //minimist(process.argv.slice(2), options);
const server = app.listen(PORT, () => {
  console.log(`Servidor escuchando en puerto ${PORT}`);
});
server.on("error", (error) => {
  console.error(`Error en el servidor ${error}`);
});
