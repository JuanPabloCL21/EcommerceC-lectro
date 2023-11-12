var express = require("express");
var app = express();
const cors = require('cors');


const productsRoute = require('./routes/products');
const orderRoute = require('./routes/order');

app.use('/api/productos', productsRoute);
app.use('/api/ordenes', orderRoute);

app.use(cors({
    origin: ["http://localhost:4200/api", "http://localhost:4200", "https://google.com"],
    methods: ["GET", "POST" , "OPTIONS", "PUT" , "PATCH" , "DELETE"]
    
    
}));

const config = {
    application: {
        cors: {
            server: [
                {
                    origin: "http://localhost:4200",
                    credentials: true
                }
            ]
        }
    }
}

app.use(function (req, res, next) {

    // Website you wish to allow to connect
    res.setHeader('Access-Control-Allow-Origin', '*');

    // Request methods you wish to allow
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

    // Request headers you wish to allow
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');

    // Set to true if you need the website to include cookies in the requests sent
    // to the API (e.g. in case you use sessions)
    res.setHeader('Access-Control-Allow-Credentials', true);

    // Pass to next layer of middleware
    next();
});



app.listen(6069, function(){
    console.log("Aplication started and listenig on port 6069");
});

