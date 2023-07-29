var express = require('express');
const AdminUserSchema = require('../schemas/adminUser-schema');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const mailjet = require("node-mailjet");
var SEED = require('../config').SEED;

var app = express();

const mail = mailjet.apiConnect(
    "036fb04fa1e8d04af086a7391abd6da6",
    "68e6831f4da20f0a76b505b6c5e76848"
);

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

app.post('/', (req, res) => {
    var body = req.body;
    var query = {};

    if (emailRegex.test(body.id)) {
        query.email = body.id;
    } else {
        query.username = body.id;
    }

    AdminUserSchema.findOne(query)
    .then((user) => {
        if (!user || !bcrypt.compareSync(body.password, user.password)) {
            return res.status(400).json({successful: false});
        }
        var token = jwt.sign({ user }, SEED, { expiresIn: 28800 });
        res.status(200).json({
            user,
            token
        });
    })
    .catch((err) => {
        res.status(500).json(err);
    });
});

app.get('/send_recover_email/:id', async (req, res, next) => {
    const id = req.params.id;
    var query = {};

    if (emailRegex.test(id)) {
        query.email = id;
    } else {
        query.username = id;
    }

    try {
		const user = await AdminUserSchema.findOne(query);
		if (!user) {
		  return res.status(404).json({ successful: false, error: 'Usuario no encontrado' });
		}
        return mail
            .post("send", { version: "v3.1" })
            .request({
                Messages: [{
                    From: {
                        Email: "munsarain22@gmail.com",
                        Name: "Kanguromath App - Administración",
                    },
                    To: [{
                        Email: user.email,
                    }],
                    Subject: "Recuperación de Contraseña",
                    HTMLPart: '<!DOCTYPE html><html><head><title>Kanguromath App - Administración | Recuperación de Contraseña</title></head><body style="font-family: Arial, sans-serif; line-height: 1.6; margin: 0; padding: 0;"><table width="100%" border="0" cellspacing="0" cellpadding="0"><tr><td><div style="max-width: 600px; margin: 30px auto; padding: 15px; border: 1px solid #cc8952; border-radius: 5px;"><img src="https://ik.imagekit.io/661ijdspv/assets/Kangaroo-eu.png" style="display: block; margin: 0 auto;"/><h2 style="text-align: center; margin-bottom: -10px;">Recuperación de contraseña</h2><p>Estimad' + (user.sex==='M'? 'o ':'a ') + user.name + ' ' + user.last_name + '</p><p>Hemos recibido una solicitud para restablecer tu contraseña. Haz clic en el enlace de abajo para continuar con el proceso de recuperación:</p><p style="text-align: center;"><a href="#" style="display: inline-block; padding: 10px 20px; background: #F59E0B; color: #fff; text-decoration: none; border-radius: 5px;">Recuperar contraseña</a></p><p>Si no has solicitado el restablecimiento de tu contraseña, ignora este correo.</p><p>Gracias, El equipo de <strong>Kanguromath App</strong> 🦘</p></div></td></tr></table></body></html>',
                },],
            })
            .then((result) => {
                return res.status(200).json({ successful: true });
            })
            .catch((err) => {
                return res.status(400).json({ successful: false, error: err });
            });
    } catch(err) {
        return res.status(400).json({ successful: false, error: err });
    }
})


module.exports = app;