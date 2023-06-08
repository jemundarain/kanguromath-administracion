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

app.post('/post_test/:test_id', multerUpload.single('testFile'), (req, res) => {
  const file = req.file;
  let testPath;

  if (!file) {
    return res.status(400).send('No file uploaded.');
  }

  const data = fs.readFileSync(file.path);

  JSZip.loadAsync(data)
    .then(zip => {
      Object.keys(zip.files).forEach((filename) => {
        const file = zip.file(filename);
        const filepath = join(__dirname, '../../uploads', filename);
        if (filepath.includes('.tex')) {
          testPath = filepath;
        }
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
      var problems = []; 
      setTimeout(() => {
        fs.readFile(testPath, 'utf8', (err, testText) => {
          if (err) {
            console.error(err);
            res.status(500).send('Error al leer el archivo');
          } 
          const main_regex = /\\pro(fig)?\{[^{}]*\}[\s\S]*?\n(\\resp\{((?:[^{}]|(?:\{[^{}]*\}))*?)\}\{((?:[^{}]|(?:\{[^{}]*\}))*?)\}\{((?:[^{}]|(?:\{[^{}]*\}))*?)\}\{((?:[^{}]|(?:\{[^{}]*\}))*?)\}\{((?:[^{}]|(?:\{[^{}]*\}))*?)\}|%\{|\\end)/g;
          const solutions_regex = /[ABCDE]{30}/g;
          const num_s_regex = /{([^{}]+)}/;
          // const pro_regex = /\\pro{(\d+)}\s*(.*)/g;
          // const profig_regex = /\\profig\{[^{}]*\}[\s\S]*?\n/g;.
          // const keys_regex = /{([^{}]+)}/g;
          const paths_regex = /{([^{}]*\.(?:png|jpe?g))}/g;
          const options_regex_resp = /\\resp\{((?:[^{}]|(?:\{[^{}]*\}))*?)\}\{((?:[^{}]|(?:\{[^{}]*\}))*?)\}\{((?:[^{}]|(?:\{[^{}]*\}))*?)\}\{((?:[^{}]|(?:\{[^{}]*\}))*?)\}\{((?:[^{}]|(?:\{[^{}]*\}))*?)\}/g;
          const options_regex_medskip = /\\[A-E]\s([^\\]+)/g;
          var rawSolutions;

          var testTextClean = testText.replace(/\\includegraphics\[[^\]]+\]/g, '')
                                        //.replace(/\\(begin|end)\{(?:pspicture|pspicture\*|postscript|TeXtoEPS|pdfpicture)\}[\s\S]*?\\(end|begin)\{(?:pspicture|postscript|TeXtoEPS|pdfpicture)\}|\\(?:psline|psframe|pscircle|psdots|pstext|psset|SpecialCoor|uput|degrees|psarc|qdisk|qline|qbezier|qlcurve|qccurve|pstVerb|newpath|moveto|lineto|arc|closepath|stroke|fill|gsave|grestore|show|quad|includegraphics|medskip|smallskip|it|raisebox)\b/g, '')
                                      .replace(/\\begin{(?:pspicture|pspicture\*)}[\s\S]*?\\end{(?:pspicture|pspicture\*)}/g);
          const rawProblems =  testTextClean.match(main_regex);

          const matchSolutions = solutions_regex.exec(testText);
          var rawSolutions = matchSolutions[0].split('');
          
          rawProblems.forEach((rawProblem, index) => {
            // Número secuencial
            var match_regex = rawProblem.match(num_s_regex);
            var num_s = match_regex[1];

            // Figuras
            var rawPaths;
            if(rawProblem.includes('profig')) {
              const matches_paths = rawProblem.match(paths_regex);
              if(matches_paths) {
                rawPaths = matches_paths.map(match => match.slice(1, -1));
              }
            }

            // Enunciado
            var statement = rawProblem;
            statement = statement.replace(/\\pro(?:fig)?\{\d+(?:\.\d+)?\}\s*/g, '')
                                 .replace(/\\resp\{.*\}/g, '')
                                 .replace(/^%.*$/gm)
                                 .replace(/{([^{}]*\.(?:png|jpe?g))}/g);

            var solution = rawSolutions[index];

            var rawOptions;
            if(!rawProblem.includes('\\resp') && rawProblem.includes('\\A') && rawProblem.includes('\\B') && rawProblem.includes('\\C') && rawProblem.includes('\\D') && rawProblem.includes('\\E')) {
              const matches_medskip = rawProblem.match(options_regex_medskip);
              if(matches_medskip)
                rawOptions = matches_medskip.map(match => match.split("\\")[1].trim());
            } else {
              const matches_resp = rawProblem.match(options_regex_resp);
              if(matches_resp) {
                rawOptions = matches_resp[0].replace('\\resp{', '').split("}{");
              }
            }

            var options = []
            if(rawOptions) {
              for(let i=0; i<5; i++) {
                options.push({
                  _id: '',
                  letter: String.fromCharCode(65 + i),
                  answer: rawOptions[i],
                  ik_id: ''
                })
              }
            }

            var figures = [];
            if(rawPaths) {
              for(let i=0; i<rawPaths.length; i++) {
                figures.push({
                  _id: '',
                  ik_id: '',
                  num_s: i+1,
                  url: rawPaths[i],
                  position: i+1==1? 'derecha':'intermedia'
                })
              }
            }

            var problem = {
              _id: '',
              statement: statement,
              solution: solution,
              category: 'sin-categoria',
              options: options,
              figures: figures
            }
            
            problems.push(problem);
          });
        });
      }, 500)
      return res.status(200).json(problems);
    })
    .catch(err => {
      console.log(err);
      res.status(500).send(err);
    });
});


module.exports = app;