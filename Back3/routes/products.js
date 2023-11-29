const express = require('express');
const router = express.Router();
const {database} = require('../config/helpers');



/*Obtener todos los productos*/
router.get('/', function(req, res) {
  
let page = (req.query.page != undefined && req.query.page != 0) ? req.query.page : 1; // establece el numero de pagina actual
const limit = (req.query.limit != undefined && req.query.limit != 0 ) ? req.query.limit : 10 ; //numero de items por pagina

let startValue;
let endValue;

if(page > 0){
  startValue = (page * limit ) - limit;  //0,10,20,30
  endValue = page * limit;
}else{
  startValue = 0;
  endValue = 10;
}

database.table('productos as p')
.join([{
  table: 'categorias as c',
  on: 'c.id = p.cat_id'
}])

.withFields(['c.titulo as categoria',
'p.titulo as nombre',
'p.precio',
'p.cantidad',
'p.imagen',
'p.id',
'p.descripcion'
])
.slice(startValue, endValue)
.sort({id: .1})
.getAll()
.then(prods => {
  if (prods.length > 0){
    res.status(200).json({
      count: prods.length,
      productos: prods
    });
  } else {
    res.json({message: 'No se encontraron productos'});
  }

}).catch(err => console.log(err));

});

/*Obetener Solo 1 producto*/
router.get('/:prodId', (req, res) => {

  let  productId = req.params.prodId;
  console.log(productId);



  database.table('productos as p')
      .join([{
        table: 'categorias as c',
        on: 'c.id = p.cat_id'
      }])

      .withFields(['c.titulo as categoria',
        'p.titulo as nombre',
        'p.precio',
        'p.cantidad',
        'p.descripcion',
        'p.imagen',
        'p.imagenes',
        'p.id',
        'p.desc_corta'
      ])
      .filter({'p.id' : productId})
      .get()
      .then(prod => {
        if (prod){
          res.status(200).json(prod);
        } else {
          res.json({message: `No se encontro el producto con el id ${productId} `});
        }

      }).catch(err => console.log(err));
});

/*Obtener todos los productos de una categoria en particular*/
router.get('/categoria/:catName', (req,res)=>{

  let page = (req.query.page != undefined && req.query.page != 0) ? req.query.page : 1; // establece el numero de pagina actual
  const limit = (req.query.limit != undefined && req.query.limit != 0 ) ? req.query.limit : 10 ; //numero de items por pagina

  let startValue;
  let endValue;

  if(page > 0){
    startValue = (page * limit ) - limit;  //0,10,20,30
    endValue = page * limit;
  }else{
    startValue = 0;
    endValue = 10;
  }

  const cat_titulo = req.params.catName;

//Buscar el nombre de la categoria de la URL
  database.table('productos as p')
      .join([{
        table: 'categorias as c',
        on: `c.id = p.cat_id WHERE c.titulo LIKE '%${cat_titulo}%'`
      }])

      .withFields(['c.titulo as categoria',
        'p.titulo as nombre',
        'p.precio',
        'p.cantidad',
        'p.imagen',
        'p.id',
        'p.descripcion'
      ])
      .slice(startValue, endValue)
      .sort({id: .1})
      .getAll()
      .then(prods => {
        if (prods.length > 0){
          res.status(200).json({
            count: prods.length,
            productos: prods
          });
        } else {
          res.json({message: `No se encontraron productos en la categoria ${cat_titulo}`});
        }

      }).catch(err => console.log(err));

});

module.exports = router;