const express = require('express');
const router = express.Router();
const {database} = require('../config/helpers');

/* Obtener todas las ordenes */



router.get('/', (req, res)=>{

database.table('detalles_orden as od')
.join([
  
  {
    table: 'ordenes as o',
    on: 'o.id = od.orden_id'
  },

  {
    table:'productos as p',
    on: 'p.id = od.productos_id'
   
  },

  {
    table: 'usuarios as u',
    on: 'u.id = o.user_id'
  }
])

.withFields(['o.id', 'p.titulo as nombre', 'p.descripcion', 'p.precio', 'u.usuario'])
.sort({id: 1})
.getAll()
.then(ordenes => {

  if(ordenes.length > 0){

     res.status(200).json(ordenes);

  } else {
    res.json({message: 'No se encontraron ordenes'});
  }

}).catch(err => console.log(err));

});

/* Obtener todas las ordenes con ID */ 
router.get('/:id', (req, res)=>{

  const ordenId = req.params.id;

  database.table('detalles_orden as od')
.join([
  
  {
    table: 'ordenes as o',
    on: 'o.id = od.orden_id'
  },

  {
    table:'productos as p',
    on: 'p.id = od.productos_id'
   
  },

  {
    table: 'usuarios as u',
    on: 'u.id = o.user_id'
  }
])

.withFields(['o.id', 'p.titulo as nombre', 'p.descripcion', 'p.precio', 'u.usuario'])
.filter({'o.id': ordenId})
.getAll()
.then(ordenes => {

  if(ordenes.length > 0){

     res.status(200).json(ordenes);

  } else {
    res.json({message: `No se encontraron ordenes con el id ${ordenId} `});
  }

}).catch(err => console.log(err));

});

/* Crear una nueva orden */
router.post('/new', (req, res) => {

  let {userid, productos} = req.body;

  if (userid != null && userid > 0 && !isNaN(userid))
  {
    database.table('ordenes')
       .insert({
           user_id: userid
       }).then(newOrderId => {

        if(newOrderId > 0){
          productos.forEach(async (p) => {
            
            let data = await database.table('productos').filter({id: p.id}).withFields([quantity]).get();

            let inCart = p.incart;

            //Reducir el numero de piezas de la orden de la columna cantidad en la base de datos

            if (data.quantity > 0){
              data.quantity = data.quantity - inCart;

              if(data.quantity < 0 ){
                data.quantity = 0;
              }

            } else {
              data.quantity = 0;
            }

            //insertar detalles de ordenes con respecto al recien generado ID de orden

            database.table('detalles_orden')
               .insert({
                order_id: newOrderId,
                product_id : p.id,
                quantity: inCart
               }).then(newId => {

                database.table('productos')
                  .filter({id: p.id})
                  .update({
                    quantity: data.quantity
                  }).then(successNum =>{}).catch(err => console.log(err));

               }).catch(err => console.log(err))

          });
        } else {
          res.json({message: `Nueva orden fallo mientras se agregaban los detalles al pedido`, success: false});
        }

        res.json({
          message: `La orden se realizo satisfactoriamente con el ID ${newOrderId} `,
          success: true,
          order_id: newOrderId,
          productos: productos
        })


       }).catch(err => console.log(err))
  }
   else {
    res.json({message: 'Nueva orden fallo', success: false});
   }

});

/*Camino a Pago, (no necesaria de momento hasta estar terminado el proyecto)*/ 
router.post('/pago', (req, res) => {
  setTimeout(() => {
    res.status(200).json({success:true});
  }, 3000)
});

module.exports = router;
