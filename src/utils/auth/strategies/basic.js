const passport = require('passport');
const { BasicStrategy } = require('passport-http');
const boom = require('@hapi/boom');

const User = require('../../../db/models/User');

passport.use(new BasicStrategy(async (email, password, cb) => {
    try {
        const user = await User.findOne({ email });
        if (!user) {
            return cb(boom.unauthorized(), false)
        }

        user.comparePassword(password, (err, isMatch) => {
            delete user.password;

            if (err) {
                return cb(err);
            }
            if (!isMatch) {
                return cb(boom.unauthorized(), false)
            }

            if (isMatch) {
                return cb(null, user);
            }
        });
    } catch (error) {
        return cb(error);
    }
}));