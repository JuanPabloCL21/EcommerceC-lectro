const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const cors = require('cors');
const app = express();



//importar Rutas
const productsRoute = require('./routes/product');
const orderRoute = require('./routes/order');

//Usar Rutas

app.use('/api/productos', productsRoute);
app.use('/api/ordenes', orderRoute);

/* CORS */ 
app.use(cors({
    /*origin: '*',
    methods: ['GET', 'PUT', 'DELETE', 'PATCH', 'POST'],
    allowedHeaders: 'Content-Type, Authorization, Origin, X-Requested-With, Accept',*/
    headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "[GET, POST, PUT, DELETE, PATCH, OPTIONS]",
        "Access-Control-Allow-Headers": "X-Requested-With, content-type, Authorization, Accept"
    }
    
}));

app.use(logger('combined'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

/*app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
   next();
  });*/



module.exports = app;
