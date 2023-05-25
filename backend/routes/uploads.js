var express = require('express');
const TestModel = require('../schemas/test-schema');
const AdminUserModel = require('../schemas/adminUser-schema');
var ImageKit = require("imagekit");
const JSZip = require('jszip');
const multer = require('multer');
const fs = require('fs');
const { dirname, extname, join } = require('path');
var readline = require('linebyline');
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
	res.json(imagekit.getAuthenticationParameters());
})

app.delete('/imagekit-delete/:ik_id', (req, res) => {
	imagekit.deleteFile(req.params.ik_id, function(error, result) {
		if(error) console.log(error);
		else console.log(result);
	});
})

app.get('/create-folder', (req, res) => {
  const folderName = req.query['folder-name'] || '';
  const parentFolderPath = req.query['parent-folder-path'] || '';
  imagekit.createFolder({ folderName, parentFolderPath }, (err, result) => {
    if (err) {
      console.log(err);
      res.status(500).json({ error: 'Error al crear la carpeta' });
    } else {
      console.log(result);
      res.status(200).json({ message: 'Carpeta creada exitosamente' });
    }
  });
});

app.post('/move-file', (req, res) => {
  imagekit.moveFile({
    sourceFilePath: req.body.sourceFilePath || '',
    destinationPath: req.body.destinationPath || '',
  }, (err, moveRes) => {
      if (err) {
        return res.status(500).json(err);
      } else {
        return res.status(200).json(moveRes);
      }
    }
  );
});

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

app.put('/put_avatar/', (req, res) => {
  AdminUserModel.updateOne(
    {'username': req.body.newAvatar.username },
    { $set: { 'figures.$.ik_id': req.body.newAvatar.ik_id }},
    {new: true}
  ).then((adminUser) => {
    if (!adminUser) {
        return res.status(404).send();
    }
    res.send(adminUser);
  }).catch((err) => {
    res.status(500).send(err);
  })
});

app.post('/post_test/:test_id', multerUpload.single('file'), (req, res) => {
  const file = req.file;
  console.log(file);

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
      // console.log('FILE:', file);
      rl = readline(join(__dirname, '../../uploads/tercero', 'tercero.tex'));

      let rawLevel;
      let rawSolutions;
      let level = '';

      rl.on('line', (line) => {

        if (line.startsWith('% c. única:')) {
          const segments = line.split(':');
          rawSolutions = segments[segments.length - 1].trim();
        }

        if (line.startsWith('\\pro') && line.match(/\\pro{\d+}\s*(.*)/)) {
          var [, num_s, statement] = line.match(/\\pro{\d+}\s*(.*)/);
        }
        
        if (line.startsWith('\\profig') && line.match(/\\profig\{(\d+)\}\{.*?\}\{([\s\S]*?)\}/)) {
          var [, num_s, statement] = line.match(/\\profig\{(\d+)\}\{.*?\}\{([\s\S]*?)\}/);
        }

        if (line.startsWith('\\resp')) {
          let match;
          let rawOptions = [];
          const regex = /{([^}]*)}/g;
          while ((match = regex.exec(line)) !== null) {
            rawOptions.push(match[1]);
          }
          rawOptions = [];
        }
      });

      // const test = {
      //   test_id: 'preliminar-' . 
      // }

      res.status(200).send('Archivo descomprimido exitosamente');
    })
    .catch(error => {
      console.log(error);
      res.status(500).send('Error al descomprimir el archivo');
    });
});

module.exports = app;