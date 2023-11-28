const express = require("express");
const router = express.Router();
const { database } = require("../config/helpers");
const crypto = require("crypto");
const bodyParser = require("body-parser");

// GET ALL ordenes
router.get("/", (req, res) => {
  database
    .table("detalles_orden as od")
    .join([
      {
        table: "ordenes as o",
        on: "o.id = od.orden_id",
      },
      {
        table: "productos as p",
        on: "p.id = od.productos_id",
      },
      {
        table: "usuarios as u",
        on: "u.id = o.user_id",
      },
    ])
    .withFields([
      "o.id",
      "p.titulo as nombre",
      "p.descripcion",
      "p.precio",
      "u.usuario",
    ])
    .getAll()
    .then((ordenes) => {
      if (ordenes.length > 0) {
        res.json(ordenes);
      } else {
        res.json({ message: "No se encontraron ordenes" });
      }
    })
    .catch((err) => res.json(err));
});

// Get Single Order
router.get("/:id", async (req, res) => {
  let orden_id = req.params.id;
  

  database
    .table("detalles_orden as od")
    .join([
      {
        table: "ordenes as o",
        on: "o.id = od.orden_id",
      },
      {
        table: "productos as p",
        on: "p.id = od.productos_id",
      },
      {
        table: "usuarios as u",
        on: "u.id = o.user_id",
      },
    ])
    .withFields([
      "o.id",
      "p.titulo as nombre",
      "p.descripcion",
      "p.precio",
      "p.imagen",
      "od.cantidad as cantidadOrdenanda",
    ])
    .filter({ "o.id": orden_id })
    .getAll()
    .then((ordenes) => {
      
      if (ordenes.length > 0) {
        res.json(ordenes);
      } else {
        res.json({ message: "No ordenes found" });
      }
    })
    .catch((err) => res.json(err));
});
// Place New Order
router.post("/new", bodyParser.json(), (req, res) => {
  
  const { user_id, productos } = req.body;


  if (user_id != null && user_id > 0) {
    database
      .table("ordenes")
      .insert({
        user_id: user_id,
      })
      .then((newOrderId) => {
   
        if (newOrderId.insertId > 0) {
          productos.forEach(async (p) => {
            const data = await database
              .table("productos")
              .filter({ id: p.id })
              .withFields(["cantidad"])
              .get();

            const inCart = parseInt(p.incart);

            // Deduct the number of pieces ordered from the quantity in database

            if (data.cantidad > 0) {
              data.cantidad = data.cantidad - inCart;

              if (data.cantidad < 0) {
                data.cantidad = 0;
              }
            } else {
              data.cantidad = 0;
            }

            // Insert order details w.r.t the newly created order Id
            database
              .table("detalles_orden")
              .insert({
                orden_id: newOrderId.insertId,
                productos_id: p.id,
                cantidad: inCart,
              })
              .then((newId) => {
                database
                  .table("productos")
                  .filter({ id: p.id })
                  .update({
                    cantidad: data.cantidad,
                  })
                  .then((successNum) => {})
                  .catch((err) => console.log(err));
              })
              .catch((err) => console.log(err));
          });
        } else {
          res.json({
            message: "Fallo  en la orden al agregar los detalles",
            success: false,
          });
        }
        res.json({
          message: `La orden se realizo satisfactoriamente con el ID ${newOrderId.insertId}`,
          success: true,
          orden_id: newOrderId.insertId,
          productos: productos,
        });
      })
      .catch((err) => res.json(err));
  } else {
    res.json({ message: "Nueva Orden Fallo", success: false });
  }
});

// Payment Gateway
router.post("/pago", (req, res) => {
  setTimeout(() => {
    res.status(200).json({ success: true });
  }, 3000);
});

module.exports = router;
