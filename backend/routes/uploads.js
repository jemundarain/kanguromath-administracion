var express = require('express');
const TestModel = require('../schemas/test-schema');
var ImageKit = require("imagekit");
const JSZip = require('jszip');
const multer = require('multer');
const fs = require('fs');
const { dirname, extname, join } = require('path');

var app = express();

const multerUpload = multer({
  storage: multer.diskStorage({
    dest: join(__dirname, '../../uploads'),
    filename: (req, file, cb) => {
      const fileExtension = extname(file.originalname);
      const fileName = file.originalname.split(fileExtension)[0];
      cb(null, `${fileName}${fileExtension}`);
    }
  })
});

var imagekit = new ImageKit({
  publicKey : 'public_VoBZkirixLnqfCe0fUaeGUj6XQs=',
  privateKey : 'private_mBXoZE1JUrqhmxHZeApipeWtAXc=',
  urlEndpoint : 'https://ik.imagekit.io/661ijdspv/'
});

app.get('/imagekit-auth', (req, res) => {
	var authenticationParameters = imagekit.getAuthenticationParameters();
	res.json(authenticationParameters);
})

app.delete('/imagekit-delete/:ik_id', (req, res) => {
	imagekit.deleteFile(req.params.ik_id, function(error, result) {
		if(error) console.log(error);
		else console.log(result);
	});
})

app.put('/put_figure/', (req, res) => {
  TestModel.updateOne(
    {'problem_id': req.body.newFigure.problem_id, 'figures.num_s': req.body.newFigure.num_s},
    { $set: { 'figures.$.ik_id': req.body.newFigure.ik_id }},
    {new: true}
  ).then((test) => {
    if (!test) {
        return res.status(404).send();
    }
    res.send(test);
  }).catch((error) => {
    res.status(500).send(error);
  })
});

app.post('/post_test', multerUpload.single('file'), (req, res) => {
  const file = req.file;

  if (!file) {
    return res.status(400).send('No file uploaded.');
  }

  // Leer el archivo cargado con fs.readFileSync
  const data = fs.readFileSync(file.path);

  // Descomprimir el archivo usando JSZip
  JSZip.loadAsync(data)
    .then(zip => {
      // Recorrer cada archivo en el zip y escribirlo en el disco
      Object.keys(zip.files).forEach(filename => {
        const file = zip.file(filename);
        const filepath = join(__dirname, '../../uploads', filename);
        if (file && file.async) {
          file.async('nodebuffer').then(content => {
            // Crear el directorio si no existe
            const dirPath = dirname(filepath);
            if (!fs.existsSync(dirPath)) {
              fs.mkdirSync(dirPath, { recursive: true });
            }
            fs.writeFileSync(filepath, content);
          });
        }
      });
      fs.unlinkSync(file.path);
      res.status(200).send('Archivo descomprimido exitosamente');
    })
    .catch(error => {
      console.log(error);
      res.status(500).send('Error al descomprimir el archivo');
    });
});

module.exports = app;