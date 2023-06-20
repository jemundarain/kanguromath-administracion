var express = require('express');
const TestModel = require('../schemas/test-schema');
const AdminUserModel = require('../schemas/adminUser-schema');
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
	res.status(200).json(imagekit.getAuthenticationParameters());
})

app.post('/upload-image/', (req, res) => {
  const body = req.body;
  fs.readFile(body.pathFile, function(err, data) {
    if (err) throw err;
    imagekit.upload({
      file : data,
      fileName : body.nameFile,
      folder: body.folderFile,
      useUniqueFileName: false
    }, function(err, result) {
      if(err) res.status(400).json(err);
      else res.status(200).json(result);
    });
  });
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
      res.status(500).json({ successful: false });
    } else {
      res.status(200).json({ successful: true });
    }
  });
});

app.post('/move-file', (req, res) => {
  imagekit.moveFile({
    sourceFilePath: req.body.sourceFilePath || '',
    destinationPath: req.body.destinationPath || '',
  }, (err, moveRes) => {
      if (err) {
        return res.status(500).json({ successful: false });
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

app.post('/upload_test', multerUpload.single('testFile'), (req, res) => {
  const file = req.file;

  if (!file) {
    return res.status(400).send({ successful: false });
  }

  const data = fs.readFileSync(file.path);

  JSZip.loadAsync(data)
    .then(zip => {
      Object.keys(zip.files).forEach((filename) => {
        const file = zip.file(filename);
        const filepath = join(__dirname, '../../uploads', filename);
        if (file && file.async) {
          file.async('nodebuffer').then(content => {
            const dirPath = dirname(filepath);
            if (!fs.existsSync(dirPath)) {
              fs.mkdirSync(dirPath, { recursive: true });
            }
            fs.writeFileSync(filepath, content);
          });
        }
      });
      res.status(200).send({ successful: false });
    })
    .catch(err => {
      res.status(500).send(err);
    });
});


module.exports = app;