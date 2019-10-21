var connection = require('../libs/dbConnection');
var bcrypt = require('bcrypt');
var LocalStrategy = require('passport-local').Strategy;
var JwtStrategy = require('passport-jwt').Strategy;
var ExtractJwt = require('passport-jwt').ExtractJwt;
const jwtOptions = {
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: 'secret'
};

module.exports = function(passport){
    passport.use(
        'jwt',
        new JwtStrategy(jwtOptions, function (payload, done) {
            connection.query('SELECT * FROM users WHERE id = ?', [payload.id],
                (err, user) => {
                    if (err) {
                        return done(err);
                    }
                    if (user) {
                        return done(null, user);
                    } else {
                        return done(null, false);
                    }
            });
        })
    );

    //TODO: add promise & async in a wrap function
    passport.use(
        'local-login',
        new LocalStrategy({
                usernameField : 'userName',
                passwordField: 'password'
            },
            function(req, done){
            console.log('here');
            if (req.body.userName && req.body.userPassword) {
                connection.query('SELECT * FROM users WHERE userName = ?', [req.body.userName],
                    function (err, rows) {
                        if (err) return done(err);
                        if (rows[0]) {
                            if (bcrypt.compareSync(req.body.userPassword, rows[0].password))
                                return done(null, rows[0]);
                            else
                            {
                                console.log('loginMessage: Wrong password. Try again, please!');
                                return done(null, false);
                            }
                        } else
                        {
                            console.log('loginMessage: This user is already exists. Please, choose another name and try again!');
                            return done(null, false);
                        }
                    });
            } else {
                console.log('registrationMessage: All fields (\"Name\", \"Create password\", \"Confirm password\") are required. Please, try again by completing them!');
                return done(null, false);
            }
            })
    );
};