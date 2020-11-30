//imports
var express = require('express');
var usersCtrl = require('./routes/api/usersCtrl');

//Router
exports.router  = (() => {
    var apiRouter = express.Router();

    //Users routes
    apiRouter.route('/users/register/').post(usersCtrl.register);
    apiRouter.route('/users/login/').post(usersCtrl.login);

    return apiRouter;
})();