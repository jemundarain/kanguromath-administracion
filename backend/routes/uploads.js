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

app.get('/imagekit_auth', (req, res) => {
	res.status(200).json(imagekit.getAuthenticationParameters());
})

app.post('/upload_figure/', (req, res) => {
  const { pathFile, folderFile, nameFile } = req.body;
  const problem_id = folderFile.split('/')[1];
  const num_s = nameFile.split('-')[0];
  fs.readFile(pathFile, function(err, data) {
    if (err) {
      if (err.code === 'ENOENT') {
        return res.status(404).json({ error: 'File not found' });
      } else {
        return res.status(500).json({ error: 'Internal server error' });
      }
    }
    imagekit.upload({
      file: data,
      fileName: nameFile,
      folder: folderFile,
      useUniqueFileName: false
    }, function(err, result) {
      if (err) {
        return res.status(400).json(err);
      } else {
        ProblemModel.updateOne(
          {'_id': problem_id, 'figures.num_s': num_s},
          { $set: { 'figures.$.ik_id': result.fileId, 'figures.$.url': result.url }},
          {new: true}
        ).then((problemUpdate) => {
          if (!problemUpdate) {
            return res.status(404);
          }
          res.status(200).json(problemUpdate);
        }).catch((err) => {
          res.status(500).json(err);
        })
      }
    });
  });
});

app.post('/upload_option_figure/', (req, res) => {
  const { pathFile, folderFile, nameFile } = req.body;
  const problem_id = folderFile.split('/')[1];
  const letter = nameFile.split('-')[0];
  fs.readFile(pathFile, function(err, data) {
    if (err) {
      if (err.code === 'ENOENT') {
        return res.status(404).json({ error: 'File not found' });
      } else {
        return res.status(500).json({ error: 'Internal server error' });
      }
    }
    imagekit.upload({
      file: data,
      fileName: nameFile,
      folder: folderFile,
      useUniqueFileName: false
    }, function(err, result) {
      if (err) {
        return res.status(400).json(err);
      } else {
        ProblemModel.updateOne(
          { '_id': problem_id, 'options.letter': letter },
          { $set: { 'options.$.ik_id': result.fileId, 'options.$.answer': result.url }},
          { new: true }
        ).then((problemUpdate) => {
          if (!problemUpdate) {
            return res.status(404);
          }
          res.status(200).json(problemUpdate);
        }).catch((err) => {
          res.status(500).json(err);
        })
      }
    });
  });
});

app.delete('/imagekit_delete/:ik_id', (req, res) => {
  imagekit.deleteFile(req.params.ik_id, function(err, result) {
    if (err) {
      res.status(500).json({ successful: false, errors: err });
    } else {
      res.status(200).json({ successful: true });
    }
  });
})


app.get('/create_folder', (req, res) => {
  const folderName = req.query['folder_name'] || '';
  const parentFolderPath = req.query['parent_folder_path'] || '';
  imagekit.createFolder({ folderName, parentFolderPath }, (err, result) => {
    if (err) {
      res.status(500).json({ successful: false });
    } else {
      res.status(200).json({ successful: true });
    }
  });
});

app.get('/list_files', (req, res) => {
  imagekit.listFiles({
    path: req.query['path']
  }, (err, response) => {
    if (err) {
      return res.status(500).json({ successful: false });
    } else {
      res.status(200).json(response);
    }
  });
});

app.post('/move_file', (req, res) => {
  imagekit.moveFile({
    sourceFilePath: req.body.sourceFilePath,
    destinationPath: req.body.destinationPath,
  }, (err, moveRes) => {
      if (err) {
        return res.status(500).json({ successful: false, errors: err });
      } else {
        return res.status(200).json(moveRes);
      }
    }
  );
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

app.delete('/delete_folder/:folderName', (req, res) => {
  const folderName = decodeURIComponent(req.params.folderName);
  if (fs.existsSync(folderName)) {
    fs.rmSync(folderName, { recursive: true });
    res.status(200).json({ successful: true });
  } else {
    res.status(404).json({ successful: false });
  }
});

module.exports = app;