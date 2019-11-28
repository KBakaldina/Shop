const bcrypt = require('bcrypt');
const queryPromise = require('../libs/dbConnection').queryPromise;
const LocalStrategy = require('passport-local').Strategy;
const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;
const FacebookStrategy  = require('passport-facebook').Strategy;

const fromCookie = (req) => {
    let token = null;
    if (req.cookies) {
        token = req.cookies.token
    }
    return token;
};

const jwtOptions = {
    jwtFromRequest: ExtractJwt.fromExtractors([fromCookie]),
    secretOrKey: process.env.JWT_SECRET
};

module.exports = (passport) => {
    passport.use(
        'jwt',
        new JwtStrategy(jwtOptions, async(payload, done) => {
            try {
                let user = await queryPromise('SELECT * FROM users WHERE id = ?', [payload.id]);
                if (user[0]) return done(null, user[0]);
                else return done(null, false);
            } catch(err) { return done(err); }
        })
    );

    passport.use(
        'local-login',
        new LocalStrategy({
                usernameField : 'userName',
                passwordField: 'userPassword'
            },
            async (userName, userPassword, done) => {
                try {
                    let rows = await queryPromise('SELECT * FROM users WHERE userName = ? OR email=?', [userName, userName]);
                    if (rows[0]) {
                        if (!rows[0].password) return done(false, 'Log in with Facebook, please!')
                        if (bcrypt.compareSync(userPassword, rows[0].password))
                            return done(rows[0]);
                        else return done(false, 'Wrong password. Try again, please!');
                    } else return done(false, 'This is no such user. Please, try again or sign up!');
                } catch(err) {
                    return done(false, 'Error... Try again later, please! ' + err.message);
                }
        })
    );

    passport.use(new FacebookStrategy({
            clientID: process.env.FB_API_KEY,
            clientSecret: process.env.FB_API_SECRET,
            callbackURL: '/login/facebook/callback',
            profileFields: ['id', 'displayName', 'email']
        },
        (accessToken, refreshToken, profile, done) => {
            process.nextTick(async () => {
                try {
                    let rows = await queryPromise('SELECT * FROM facebook WHERE fbId=?', [profile.id]);
                    if (rows[0]) {
                        await queryPromise('UPDATE facebook SET token=? WHERE fbId=?', [accessToken, profile.id]);
                        return done({id: rows[0].userId, userName: profile.displayName});
                    }
                    if (profile._json.email)  {
                        rows = await queryPromise('SELECT * FROM users WHERE email=?', [profile._json.email]);
                        if (rows[0]) return done(false, 'Your email is already used! Log in without Facebook, please!')
                    }
                    rows = await queryPromise("INSERT INTO users(userName, email) VALUES(?, ?)",
                        [profile.displayName, profile._json.email]);
                    await queryPromise("INSERT INTO facebook(fbId, userId, token) VALUES(?, ?, ?)",
                        [profile.id, rows.insertId, accessToken]);
                    return done({id: rows.insertId, userName: profile.displayName});
                } catch (err) { done(false, err); }
            });
        }
    ));
};