/** Dependencies */
const express = require('express');
const passport = require('passport');

/** Auth Strategy */
require('../utils/auth/strategies/jwt');

/** Middlewares */
const permissionsValidationHandler = require('../utils/middlewares/permissionsValidationHandler');

const router = express.Router();

router.get(
    '/start',
    passport.authenticate('jwt', { session: false }),
    permissionsValidationHandler(['start:chat']),
    (req, res) => {
        res.json({
            message: 'Chat started'
        });
    }
);

module.exports = router;