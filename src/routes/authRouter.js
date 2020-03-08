/** Dependencies */
const express = require('express');
const passport = require('passport');
const jwt = require('jsonwebtoken');
const boom = require('@hapi/boom');

/** Models */
const User = require('../db/models/User');
const Rol = require('../db/models/Rol');
const Permission = require('../db/models/Permission');

/** Basic Strategy */
require('../utils/auth/strategies/basic');

const router = express.Router();

const THIRTY_DAYS_IN_SEC = 2592000;
const TWO_HOURS_IN_SEC = 7200;
router.post('/login', async (req, res, next) => {
    const { rememberMe } = req.body;

    passport.authenticate('basic', (error, user) => {
        try {
            if (error || !user) {
                next(boom.unauthorized());
            }
            req.login(user, { session: false }, async (error) => {
                if (error) {
                    next(error)
                }

                const { _id: id, email } = user;

                // Busca los permissions id del rol del usuario
                const { permissions: permissionsId } = await Rol.findById(user.rol)
                // Busca los "may" partiendo de los permissions id
                const permissions = await Promise.all(permissionsId.map(async permission => (await Permission.findById(permission)).may));

                const payload = {
                    sub: id,
                    email,
                    permissions
                }

                const token = jwt.sign(payload, process.env.AUTH_JWT_SECRET, {
                    expiresIn: '15m'
                });

                // Si el atributo rememberMe es verdadero la expiración será en 30 dias
                // de lo contrario la expiración será en 2 horas
                res.cookie("token", token, {// ¿ Cookie parser?
                    httpOnly: process.env.NODE_ENV === 'production',
                    secure: process.env.NODE_ENV === 'production',
                    maxAge: rememberMe ? THIRTY_DAYS_IN_SEC : TWO_HOURS_IN_SEC
                });


                return res.status(200).json({
                    token,
                    user: {
                        id,
                        email
                    }
                });
            });
        } catch (error) {
            next(error)
        }
    })(req, res, next);
});

router.post('/signup', async (req, res, next) => {
    const { email, password } = req.body;
    try {
        const newUser = new User();
        newUser.email = email;
        newUser.password = password
        const rol = await Rol.findOne({ name: 'Admin' });
        newUser.rol = rol;
        await newUser.save();

        res.status(201).json({
            data: newUser._id,
            message: 'User created'
        });
    } catch (error) {
        next(error)
    }
});


module.exports = router;