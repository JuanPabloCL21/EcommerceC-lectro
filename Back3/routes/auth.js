const express = require('express');
const {check, validationResult, body} = require('express-validator');
const router = express.Router();
const helper = require('../config/helpers');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const bodyParser = require('body-parser');


// LOGIN ROUTE
router.post('/login', [helper.hasAuthFields, helper.isPasswordAndUserMatch], bodyParser.json(), (req, res) => {
    let token = jwt.sign({state: 'true', email: req.body.email, username: req.body.usuario}, helper.secret, {
        algorithm: 'HS512',
        expiresIn: '4h'
    });
    res.json({token: token, auth: true, email: req.body.email, username: req.body.usuario});
});

// REGISTER ROUTE
router.post('/register', [
    check('email').isEmail().not().isEmpty().withMessage('Field can\'t be empty')
        .normalizeEmail({all_lowercase: true}),
    check('contraseña').escape().trim().not().isEmpty().withMessage('Field can\'t be empty')
        .isLength({min: 6}).withMessage("must be 6 characters long"),
    body('email').custom(value => {
        return helper.database.table('usuarios').filter({
            $or:
                [
                    {email: value}, {username: value.split("@")[0]}
                ]
        }).get().then(user => {
            if (user) {
                console.log(user);
                return Promise.reject('Email / Username already exists, choose another one.');
            }
        })
    })
], bodyParser.json(), async (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return res.status(422).json({errors: errors.array()});
    } else {

        let email = req.body.email;
        let usuario = email.split("@")[0];
        let contraseña = await bcrypt.hash(req.body.contraseña, 10);
        let Nombre = req.body.Nombre;
        let Apellido = req.body.Apellido;

        /**
         * ROLE 777 = ADMIN
         * ROLE 555 = CUSTOMER
         **/
        helper.database.table('usuarios').insert({
            username: usuario,
            password: contraseña,
            email: email,
            role: 555,
            lname: Apellido || null,
            fname: Nombre || null
        }).then(lastId => {
            if (lastId > 0) {
                res.status(201).json({message: 'Registration successful.'});
            } else {
                res.status(501).json({message: 'Registration failed.'});
            }
        }).catch(err => res.status(433).json({error: err}));
    }
});


module.exports = router;