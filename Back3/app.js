var express = require("express");
var app = express();
const cors = require('cors');

app.use(cors({
    origin: 'http://localhost:4200', // Reemplaza con la URL de tu aplicación Angular
    optionsSuccessStatus: 200,
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS'
}));


const productsRoute = require('./routes/products');
const orderRoute = require('./routes/order');

app.use('/api/productos', productsRoute);
app.use('/api/ordenes', orderRoute);




app.listen(6069, function(){
    console.log("Aplication started and listenig on port 6069");
});



