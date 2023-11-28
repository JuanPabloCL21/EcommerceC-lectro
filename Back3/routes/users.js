const express = require('express');
const router = express.Router();
const {database} = require('../config/helpers');
const bodyParser = require('body-parser');

/* GET users listing. */
router.get('/', function (req, res) {
    database.table('usuarios')
        .withFields([ 'usuario' , 'email', 'Nombre', 'Apellido', 'edad', 'rol', 'id' ])
        .getAll().then((list) => {
        if (list.length > 0) {
            res.json({users: list});
        } else {
            res.json({message: 'NO SE ENCONTRO USUARIO'});
        }
    }).catch(err => res.json(err));
});

/**
 * ROLE 777 = ADMIN
 * ROLE 555 = CUSTOMER
 */


/* GET ONE USER MATCHING ID */
router.get('/:userId', bodyParser.json(), (req, res) => {
    let userId = req.params.userId;
    console.log(req.body);
    database.table('usuarios').filter({id: userId})
        .withFields([ 'usuario' , 'email','Nombre', 'Apellido', 'Edad', 'rol', 'id' ])
        .get().then(user => {
        if (user) {
            res.json({user});
        } else {
            res.json({message: `NO SE ENCONTRARON USUARIOS CON EL ID : ${userId}`});
        }
    }).catch(err => res.json(err) );
});

/* UPDATE USER DATA */
router.patch('/:userId', bodyParser.json(), async (req, res) => {
   
    let userId = req.params.userId;     // Get the User ID from the parameter

  // Search User in Database if any
    let user = await database.table('usuarios').filter({id: userId}).get();
    if (user) {
        
        let userEmail = req.body.email;
        let userContraseña = req.body.contraseña;
        let userNombre = req.body.Nombre;
        let userApellido = req.body.Apellido;
        let userUsuario = req.body.usuario;
        let edad = req.body.edad;

        // Replace the user's information with the form data ( keep the data as is if no info is modified )
        database.table('usuarios').filter({id: userId}).update({
            email: userEmail !== undefined ? userEmail : user.email,
            password: userContraseña !== undefined ? userContraseña : user.password,
            username: userUsuario !== undefined ? userUsuario : user.username,
            fname: userNombre !== undefined ? userNombre : user.fname,
            lname: userApellido !== undefined ? userApellido : user.lname,
            edad: edad !== undefined ? edad : user.edad
        }).then(result => res.json('USUARIO ACTIALIZADO CON EXITO')).catch(err => res.json(err));
    }
});

module.exports = router;