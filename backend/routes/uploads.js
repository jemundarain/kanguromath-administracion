var express = require('express');
const TestModel = require('../schemas/test-schema');
var ImageKit = require("imagekit");

var app = express();

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

// app.put('/imagekit-rename', (req, res) => {
//   imagekit.renameFile({
//     filePath: req.body.filePath,
//     newFileName: req.body.newFileName,
//     purgeCache: false
//   }, function(error, result) {
//     if(error) console.log(error);
//     else console.log(result);
//   });
// })

// app.delete('/delete_cache/:problem_id/:num_s', (req, res) => {
//   imagekit.purgeCache(`https://ik.imagekit.io/661ijdspv/${req.params.problem_id}/${req.params.num_s}.png`, function(error, result) { 
//     if(error) res.json(error);
//     else res.json(result);
//   });
// }) 

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

module.exports = app;