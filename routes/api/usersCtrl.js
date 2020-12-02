//import
var bcrypt = require('bcrypt');
var jwtUtils = require('../../utils/jwt.utils');
var models = require('../../models');
var asyncLib = require('async');

//constants
const EMIAL_REGEX = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
const PASSWORD_REGEX = /^(?=.*\d).{4.8}$/;

//Routes
module.exports = {
    register: function (req, res) {

        //Params
        var email = req.body.email;
        var username = req.body.username;
        var password = req.body.password;
        var bio = req.body.bio;

        if (email === null || username === null || password === null)
        {
            return res.status(400).json({ 'error': 'missing parameters' });
        }

        if (username.length >= 13 || username.length <= 4)
        {
            return res.status(400).json({ 'error': 'username must contains 5-12 caracters' });
        }

        if (!EMIAL_REGEX.test(email))
        {
            return res.status(400).json({ 'error': 'email is not valid' });
        }

        if (!PASSWORD_REGEX.test(password))
        {
            return res.status(400).json({ 'error': 'password is not valid (must have a length 4-8 caracters and include 1 number at list' });
        }

        //waterfall
        asyncLib.waterfall([
            (done) => {
                models.User.findOne({
                    attributes: ['email'],
                    where: { email: email }
                })
                .then((userFound) => {
                    done(null, userFound);
                })
                .catch((err) => {
                    return res.status(500).json({ 'error': 'unable to verify user' });
                });
            },
            (userFound, done) => {
                if (!userFound)
                {
                    bcrypt.hash(password, 5, (err, bcryptedPassword) => {
                        done(null, userFound, bcryptedPassword);
                    });
                }
                else
                {
                    return res.status(409).json({ 'error': 'user already exist' });
                }
            },
            (userFound, bcryptedPassword, done) => {
                var newUser = models.User.create({
                    email: email,
                    username: username,
                    password: bcryptedPassword,
                    bio: bio,
                    isAdmin: 0
                })
                .then((newUser) => {
                    done(newUser);
                })
                .catch((err) => {
                    return res.status(500).json({ 'error': 'cannot add user' });
                });
            }
        ], (newUser) => {
            if (newUser) 
            {
                return res.status(201).json({ 
                    'userId': newUser.id
                });
            }
            else return res.status(500).json({ 'error': 'can not add user' });
        })

        //verify pseud length, email regex, password etc.
        // models.User.findOne({
        //     attributes: ['email'],
        //     where: { email: email }
        // })
        // .then((userFound) => {
        //     if (!userFound) 
        //     {

        //         bcrypt.hash(password, 5, (err, bcryptedPassword) => {
        //             var newUser = models.User.create({
        //                 email: email,
        //                 username: username,
        //                 password: bcryptedPassword,
        //                 bio: bio,
        //                 isAdmin: 0
        //             })
        //             .then((newUser) => {
        //                 return res.status(201).json({
        //                     'userId': newUser.id
        //                 })
        //             })
        //             .catch((err) => {
        //                 return res.status(500).json({ 'error': 'unable to verify user' });
        //             });
        //         });

        //     }
        //     else
        //     {
        //         return res.status(409).json({ 'error': 'user already exist' });
        //     }
        // })
        // .catch((err) => {
        //     return res.status(500).json({ 'error': 'unable to verify user' });
        // });
        
    },
    login: (req, res) => {

        //Params
        var email = req.body.email;
        var password = req.body.password;

        if (email === null || password === null)
        {
            return res.status(400).json({ 'error': 'missing params' });
        }

        //verify mail & password length

        models.User.findOne({
            where: { email: email }
        })
        .then((userFound) => {
            if (userFound)
            {

                bcrypt.compare(password, userFound.password, (errBcryt, resBcrypt) => {
                    if (resBcrypt)
                    {
                        return res.status(200).json({
                            'userId': userFound.id,
                            'token': jwtUtils.generateTokenForUser(userFound)
                        });
                    }
                    else
                    {
                        return res.status(403).json({ 'error': 'invalid password' });
                    }
                })
            }
            else
            {
                return res.status(404).json({ 'error': 'user not exist' });
            }
        })
        .catch((err) => {
            return res.status(500).json({ 'error': 'unable to verify user' });
        });

    }
}