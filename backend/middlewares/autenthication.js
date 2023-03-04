var jwt = require('jsonwebtoken');
var SEED = require('../config').SEED;

exports.verificaToken = function(req, res, next) {
    var token = req.query.token;
    jwt.verify(token, SEED, (err, decoded) => {
        if (err) {
            return res.status(401).json({
                message: 'token error',
                errors: err
            });
        }
        req.usuario = decoded.usuario;
        next();
    });
}