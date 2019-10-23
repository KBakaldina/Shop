const connection = require('../libs/dbConnection');
const bcrypt = require('bcrypt');
const LocalStrategy = require('passport-local').Strategy;
const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;

const fromCookie = (req) => {
    let token = null;
    if (req.cookies) {
        token = req.cookies.token
    }
    return token;
};

const jwtOptions = {
    jwtFromRequest: ExtractJwt.fromExtractors([fromCookie]),
    secretOrKey: 'secret'
};

module.exports = (passport) => {
    passport.use(
        'jwt',
        new JwtStrategy(jwtOptions, async(payload, done) => {
            await connection.query('SELECT * FROM users WHERE id = ?', [payload.id],
                (err, user) => {
                    if (err) {
                        return done(err);
                    }
                    if (user) {
                        return done(null, user[0]);
                    } else {
                        return done(null, false);
                    }
            });
        })
    );

    passport.use(
        'local-login',
        new LocalStrategy({
                usernameField : 'userName',
                passwordField: 'userPassword'
            },
            async (userName, userPassword, done) => {
            await connection.query('SELECT * FROM users WHERE userName = ?', [userName],
                (err, rows) => {
                if (err) return done(false, 'Error... Try again later, please!');
                if (rows[0]) {
                    if (bcrypt.compareSync(userPassword, rows[0].password))
                        return done(rows[0]);
                    else return done(false, 'Wrong password. Try again, please!');
                } else return done(false, 'This is no such user. Please, try again or sign up!');
            });
        })
    );
};