const passport = require('passport');
const { Strategy, ExtractJwt } = require('passport-jwt');
const boom = require('@hapi/boom');

const User = require('../../../db/models/User');

passport.use(
    new Strategy(
        {
            secretOrKey: process.env.AUTH_JWT_SECRET,
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken()
        },
        async (tokenPayload, cb) => {
            try {
                const user = await User.find({ email: tokenPayload.email });

                if (!user) {
                    return cb(boom.unauthorized(), false);
                }

                delete user.password;
                cb(null, { ...user, permissions: tokenPayload.permissions });

            } catch (error) {
                return cb(error);
            }
        }
    )
);