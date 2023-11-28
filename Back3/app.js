var express = require("express");
var app = express();
const cors = require("cors");
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const swaggerJSDoc = require('swagger-jsdoc');
const swaggerUI = require('swagger-ui-express');
const path = require('path');

app.use(
  cors({
    origin: "http://localhost:4200", // Reemplaza con la URL de tu aplicación Angular
    optionsSuccessStatus: 200,
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS",
  })
);

const swaggerOptions = {
  swaggerDefinition: {
      info: {
          title: "Shop Api",
          description: "Backend Api",
          contact: {
              name: 'Clectro'
          },
          servers: "http://localhost:6069"
      }
  },
  apis: ["app.js", ".routes/*.js"]
};

app.use(logger('combined'));
app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

const swaggerDocs = swaggerJSDoc(swaggerOptions);
app.use('/api/docs', swaggerUI.serve, swaggerUI.setup(swaggerDocs));

const productsRoute = require("./routes/products");
const orderRoute = require("./routes/order");
const usersRoute = require("./routes/users");
const authRoute = require("./routes/auth");

// Define Routes
/**
 * @swagger
 * /api/productos:
 *   get:
 *    descripcion: Get All Products
 *
 */

app.use("/api/productos", productsRoute);
app.use("/api/ordenes", orderRoute);
app.use("/api/users", usersRoute);
app.use("/api/auth", authRoute);

app.listen(6069, function () {
  console.log("Aplication started and listenig on port 6069");
});
