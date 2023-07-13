var express = require('express');
const ProblemModel = require('../schemas/problem-schema');
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
    if (err) {
      if (err.code === 'ENOENT') {
        return res.status(404).json({ error: 'File not found' });
      } else {
        return res.status(500).json({ error: 'Internal server error' });
      }
    }

    imagekit.upload({
      file: data,
      fileName: body.nameFile,
      folder: body.folderFile,
      useUniqueFileName: false
    }, function(err, result) {
      if (err) {
        return res.status(400).json(err);
      } else {
        return res.status(200).json(result);
      }
    });
  });
});


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

app.get('/list-files', (req, res) => {
  imagekit.listFiles({
    path: req.query['path']
  }, (err, response) => {
    if (err) {
      return res.status(500).json({ successful: false });
    } else {
      return res.status(200).json(response);
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
  const body = req.body;
  ProblemModel.updateOne(
    {'_id': body.problem_id, 'figures.num_s': body.figure.num_s},
    { $set: { 'figures.$.ik_id': body.figure.ik_id, 'figures.$.url': body.figure.url }},
    {new: true}
  ).then((problemUpdate) => {
    if (!problemUpdate) {
      return res.status(404);
    }
    res.status(200).json(problemUpdate);
  }).catch((err) => {
    res.status(500).json(err);
  })
});

app.put('/put_option_figure/', (req, res) => {
  const body = req.body;
  ProblemModel.updateOne(
    { '_id': body.problem_id, 'options.letter': body.option.letter },
    { $set: { 'options.$.ik_id': body.option.ik_id, 'options.$.answer': body.option.answer }},
    { new: true }
  ).then((problemUpdate) => {
    if (!problemUpdate) {
      return res.status(404);
    }
    res.status(200).json(problemUpdate);
  }).catch((err) => {
    res.status(500).json(err);
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