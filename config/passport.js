var LocalStrategy = require('passport-local').Strategy;
var connection = require('../libs/dbConnection');
var bcrypt = require('bcrypt');

module.exports = function(passport){
    passport.serializeUser(function(user, done){
        done(null, user.id);
    });

    passport.deserializeUser(function(id, done){
        connection.query("SELECT * FROM users WHERE id = ? ", [id],
            function(err, rows){
                done(err, rows[0]);
            });
    });

    passport.use(
        'local-registration',
        new LocalStrategy({
                usernameField : 'username',
                passwordField: 'password',
                passReqToCallback: true
            },
            function(req, userName, userPassword, userPassword2, done){
                var sqlFindUser='SELECT * FROM users WHERE login = ?';
                var sqlCreateNewUser='INSERT INTO users(login, password) VALUES (?, ?)';

                connection.query(sqlFindUser,
                    [userName], function(err, rows){
                        if(err) return done(err);
                        if(!rows[0]){
                            if(userPassword == userPassword2){
                                var newUserMysql = {
                                    userName: userName,
                                    password: bcrypt.hashSync(userPassword, 5)
                                };

                                connection.query(sqlCreateNewUser, [newUserMysql.username, newUserMysql.password],
                                function(err, rows){
                                    newUserMysql.id = rows.insertId;
                                    return done(null, newUserMysql);
                                });}
                            else return done(null, false, 'Incorrect conformation of password. Try again, please!');
                        }else return done(null, false, 'This user is already exists. Please, choose another name and try again!');
                });
            })
    );

    passport.use(
        'local-login',
        new LocalStrategy({
                usernameField : 'username',
                passwordField: 'password',
                passReqToCallback: true
            },
            function(req, userName, userPassword, done){
                connection.query("SELECT * FROM users WHERE username = ? ", [userName],
                    function(err, rows){
                        if(err) return done(err);
                        if(rows[0]){
                            if(bcrypt.compareSync(userPassword, rows[0].password))
                                return done(null, rows[0]);
                            else return done(null, false, 'Wrong password. Try again, please!');
                        } else return done(null, false, 'This user is already exists. Please, choose another name and try again!');
                    });
            })
    );
};