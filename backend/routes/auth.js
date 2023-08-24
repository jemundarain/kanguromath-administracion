var express = require('express');
const AdminUserSchema = require('../schemas/adminUser-schema');
const UserSchema = require('../schemas/user-schema');
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

app.get('/send_recovery_email/:id', async (req, res, next) => {
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

    const token = jwt.sign({ userId: user._id }, SEED, { expiresIn: '1h' });  
    const recoveryLink = `https://main--chic-torrone-c8b8ab.netlify.app/auth/reset-contrasena/false/${token}`;

    return mail
      .post('send', { version: 'v3.1' })
      .request({
        Messages: [{
          From: {
            Email: 'munsarain22@gmail.com',
            Name: 'Kanguromath App - Administración',
          },
          To: [
            {
              Email: user.email,
            },
          ],
          Subject: 'Recuperación de Contraseña',
          HTMLPart:
            '<!DOCTYPE html><html><head><title>Kanguromath App - Administración | Recuperación de Contraseña</title></head>' +
            '<body>' +
            '<table width="100%" border="0" cellspacing="0" cellpadding="0">' +
            '  <tr>' +
            '    <td>' +
            '      <div style="max-width: 600px; margin: 30px auto; padding: 15px; border: 1px solid #525fE1; border-radius: 5px;">' +
            '        <img src="https://ik.imagekit.io/661ijdspv/assets/Kangaroo-eu.png" style="display: block; margin: 0 auto;"/>' +
            '        <h2 style="text-align: center; margin-bottom: -10px;">Recuperación de contraseña</h2>' +
            '        <p>Estimad' + (user.sex === 'M' ? 'o ' : 'a ') + user.name + ' ' + user.last_name + '</p>' +
            '        <p>Hemos recibido una solicitud para restablecer tu contraseña. Haz clic en el enlace de abajo para continuar con el proceso de recuperación:</p>' +
            '        <p style="text-align: center;"><a href="' + recoveryLink + '" style="display: inline-block; padding: 10px 20px; background: #525fE1; color: #fff; text-decoration: none; border-radius: 5px; transition: background-color 0.3s;">Recuperar contraseña</a></p>' +
            '        <p>Si no has solicitado el restablecimiento de tu contraseña, ignora este correo.</p>' +
            '        <p>Gracias, El equipo de <strong>Kanguromath App</strong> 🦘</p>' +
            '      </div>' +
            '    </td>' +
            '  </tr>' +
            '</table></body></html>',
        }],
      })
      .then((result) => {
        return res.status(200).json({ successful: true });
      })
      .catch((err) => {
        return res.status(400).json({ successful: false, error: err });
      });
  } catch (err) {
    console.log("🚀 ~ file: auth.js:109 ~ app.get ~ err:", err)
    return res.status(400).json({ successful: false, error: err });
  }
});

app.get('/validate_recovery_token/:app/:token', async (req, res) => {
    const token = req.params.token;
    const app = JSON.parse(req.params.app);

    try {
      const verify = jwt.verify(token, SEED);
      if(app){
        var user = await UserSchema.findOne({ '_id': verify.userId });
      } else {
        var adminUser = await AdminUserSchema.findOne({ '_id': verify.userId });
      }
      
      if (app && !user) {
        return res.status(404).json({ successful: false, error: 'Token inválido' });
      }

      if (!app && !adminUser) {
        return res.status(404).json({ successful: false, error: 'Token inválido' });
      }
  
      if (app) {
        return res.status(200).json({ successful: true, user });
      } else {
        return res.status(200).json({ successful: true, adminUser });
      }
    } catch (err) {
      if (err.name === 'TokenExpiredError') {
        return res.status(401).json({ successful: false, error: 'Token expirado' });
      } else if (err.name === 'JsonWebTokenError') {
        return res.status(401).json({ successful: false, error: 'Token inválido' });
      } else {
        return res.status(400).json({ successful: false, error: 'Error al procesar el token' });
      }
    }
});

app.put('/set_new_password', async (req, res) => {
  const { app, _id, password } = req.body;
  console.log("🚀 ~ file: auth.js:152 ~ app.put ~ req.body:", req.body)

  try {
    if(app) {
      var user = await UserSchema.findById(_id);
    }
    var adminUser = await AdminUserSchema.findById(_id);

    if (app && !user) {
      return res.status(404).json({ successful: false, error: 'Usuario no encontrado' });
    }

    if (!app && !adminUser) {
      return res.status(404).json({ successful: false, error: 'Usuario no encontrado' });
    }
  
    if(app) {
      user.password = bcrypt.hashSync(password, 10);
      await user.save();
    } else {
      adminUser.password = bcrypt.hashSync(password, 10);
      await adminUser.save();
    }
    return res.status(200).json({ successful: true });
  } catch (err) {
    console.log("🚀 ~ file: auth.js:175 ~ app.put ~ err:", err)
    return res.status(500).json({ successful: false, error: err });
  }
});

module.exports = app;