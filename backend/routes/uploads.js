var express = require('express');
const ProblemModel = require('../schemas/problem-schema');
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

app.get('/imagekit_auth', async (req, res) => {
  try {
    const authParameters = imagekit.getAuthenticationParameters();
    res.status(200).json(authParameters);
  } catch (err) {
    res.status(500).json({ successful: false, errors: err });
  }
});

app.post('/upload_figure/', async (req, res) => {
  try {
    const { pathFile, folderFile, nameFile } = req.body;
    const problem_id = folderFile.split('/')[1];
    const numS = nameFile.split('-')[0];

    fs.readFile(pathFile, async (err, data) => {
      if (err) {
        if (err.code === 'ENOENT') {
          return res.status(404).json({ error: 'File not found' });
        } else {
          return res.status(500).json({ error: 'Internal server error' });
        }
      }

      const uploadFile = (data) => {
        return new Promise((resolve, reject) => {
          imagekit.upload({
            file: data,
            fileName: nameFile,
            folder: folderFile,
            useUniqueFileName: false
          }, (err, result) => {
            if (err) {
              reject(err);
            } else {
              resolve(result);
            }
          });
        });
      };

      const result = await uploadFile(data);

      const problemUpdate = await ProblemModel.updateOne(
        { _id: problem_id, 'figures.num_s': numS },
        { $set: { 'figures.$.ik_id': result.fileId, 'figures.$.url': result.url } },
        { new: true }
      );

      if (!problemUpdate) {
        return res.status(404);
      }

      res.status(200).json(problemUpdate);
    });
  } catch (err) {
    res.status(500).json({ successful: false, errors: err });
  }
});

app.post('/upload_option_figure/', async (req, res) => {
  try {
    const { pathFile, folderFile, nameFile } = req.body;
    const problemId = folderFile.split('/')[1];
    const letter = nameFile.split('-')[0];

    fs.readFile(pathFile, async (err, data) => {
      if (err) {
        if (err.code === 'ENOENT') {
          return res.status(404).json({ error: 'File not found' });
        } else {
          return res.status(500).json({ error: 'Internal server error' });
        }
      }

      const uploadFile = (data) => {
        return new Promise((resolve, reject) => {
          imagekit.upload({
            file: data,
            fileName: nameFile,
            folder: folderFile,
            useUniqueFileName: false
          }, (err, result) => {
            if (err) {
              reject(err);
            } else {
              resolve(result);
            }
          });
        });
      };

      const result = await uploadFile(data);

      const problemUpdate = await ProblemModel.updateOne(
        { '_id': problemId, 'options.letter': letter },
        { $set: { 'options.$.ik_id': result.fileId, 'options.$.answer': result.url }},
        { new: true }
      );

      if (!problemUpdate) {
        return res.status(404);
      }

      res.status(200).json(problemUpdate);
    });
  } catch (err) {
    res.status(500).json({ successful: false, errors: err });
  }
});

app.delete('/imagekit_delete/:ikId', async (req, res) => {
  try {
    const { ikId } = req.params;
    await imagekit.deleteFile(ikId);
    res.status(200).json({ successful: true });
  } catch (err) {
    res.status(500).json({ successful: false, errors: err });
  }
});

app.get('/create_folder', async (req, res) => {
  try {
    const folderName = req.query['folder_name'] || '';
    const parentFolderPath = req.query['parent_folder_path'] || '';
    
    const result = await new Promise((resolve, reject) => {
      imagekit.createFolder({ folderName, parentFolderPath }, (err, result) => {
        if (err) {
          reject(err);
        } else {
          resolve(result);
        }
      });
    });

    res.status(200).json({ successful: true });
  } catch (err) {
    res.status(500).json({ successful: false, error: err });
  }
});

app.get('/list_files', async (req, res) => {
  try {
    const path = req.query['path'];

    const response = await new Promise((resolve, reject) => {
      imagekit.listFiles({ path }, (err, response) => {
        if (err) {
          reject(err);
        } else {
          resolve(response);
        }
      });
    });

    res.status(200).json(response);
  } catch (err) {
    res.status(500).json({ successful: false, error: err });
  }
});

app.post('/move_file', async (req, res) => {
  try {
    const sourceFilePath = req.body.sourceFilePath;
    const destinationPath = req.body.destinationPath;

    const moveRes = await new Promise((resolve, reject) => {
      imagekit.moveFile({ sourceFilePath, destinationPath }, (err, moveRes) => {
        if (err) {
          reject(err);
        } else {
          resolve(moveRes);
        }
      });
    });

    res.status(200).json(moveRes);
  } catch (err) {
    res.status(500).json({ successful: false, errors: err });
  }
});

app.post('/upload_test', multerUpload.single('testFile'), async (req, res) => {
  try {
    const file = req.file;

    if (!file) {
      return res.status(400).send({ successful: false });
    }

    const data = fs.readFileSync(file.path);
    const zip = await JSZip.loadAsync(data);

    const filePromises = Object.keys(zip.files).map(async (filename) => {
      const file = zip.file(filename);
      const filepath = join(__dirname, '../../uploads', filename);

      if (file && file.async) {
        const content = await file.async('nodebuffer');
        const dirPath = dirname(filepath);

        if (!fs.existsSync(dirPath)) {
          fs.mkdirSync(dirPath, { recursive: true });
        }

        fs.writeFileSync(filepath, content);
      }
    });

    await Promise.all(filePromises);

    res.status(200).send({ successful: true });
  } catch (err) {
    res.status(500).json({ successful: false, errors: err });
  }
});

app.delete('/delete_folder/:folderName', (req, res) => {
  try {
    const folderName = decodeURIComponent(req.params.folderName);

    if (fs.existsSync(folderName)) {
      fs.rmSync(folderName, { recursive: true });
      res.status(200).json({ successful: true });
    } else {
      res.status(404).json({ successful: false });
    }
  } catch (err) {
    res.status(500).json({ successful: false, error: err });
  }
});

module.exports = app;