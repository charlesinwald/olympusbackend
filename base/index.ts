var express = require('express'),
  app = express(),
  path = require('path'),
  less = require('less-middleware');
const fileUpload = require('express-fileupload');
import {parseModel} from './parse.js';

var multer = require('multer')
var upload = multer({
  dest: 'uploads/'
})

//used for parsing JSON body
const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({
  extended: true
}));

app.use(bodyParser.json());

// compile and serve css
app.use(less(path.join(__dirname, 'source', 'less'), {
  dest: path.join(__dirname, 'public'),
  options: {
    compiler: {
      compress: false,
    },
  },
  preprocess: {
    path: function(pathname, req) {
      return pathname.replace('/css/', '/');
    },
  },
  force: true,
}));

// Returns the current date and time 
function myDateTime() {
  return Date()
}


//Prints the current path, helper function
function currentPath(req) {
  console.log(req.originalUrl); // '/admin/new'
  console.log(req.baseUrl); // '/admin'
  console.log(req.path); // '/new'
}

// serve static content
app.use(express.static(path.join(__dirname, 'public')));


//hosts the current image
app.use('/image', function(req, res) {
  var fs = require('fs');
  var image = fs.readFileSync('/home/cabox/workspace/base/d.jpg');
  res.send(image);
});



app.use(fileUpload());
function saveFile(sampleFile: string | {} | any | ArrayBuffer) {
    var fs = require('fs');
    //Use the mv() method to place the file somewhere on server
    fs.writeFile("/home/cabox/workspace/base/public/image/d.jpg", sampleFile, function (err) {
        if (err) {
            return console.log(err);
        }

        console.log("The file was saved!");
    });
    var imageAsBase64 = fs.readFileSync('/home/cabox/workspace/base/public/image/d.jpg');
    var encoded = new Buffer(imageAsBase64).toString('base64');
    console.log("ENCODED: " + encoded);
    console.log(typeof sampleFile);
}

app.post('/upload', function(req, res) {
  if (!req.files)
    return res.status(400).send('No files were uploaded.');

  // The name of the input field used to retrieve the uploaded file
  let sampleFile = req.files.file.data;

  var x = req.body;
  console.log(sampleFile);
  console.dir(sampleFile);
  var mv = require('mv');
    saveFile(sampleFile);
  var filename = '/home/cabox/workspace/base/public/image/d.jpg';


  var request = require("request");

  var options = {
    method: 'POST',
    url: 'https://vision.googleapis.com/v1/images:annotate',
    qs: {
      key: 'AIzaSyAWgZFieZJBX0ImbMmOuT9GKeLiiPJnfmo'
    },
    headers: {
      'postman-token': '7d45cfcc-27a4-0d99-cd0e-a7c020a73c67',
      'cache-control': 'no-cache'
    },
    body: '{\n  "requests":[\n    {\n      "image":{\n        "source":{\n          "imageUri":\n            "http://olympusbackend-cci219706483.codeanyapp.com:1337/image/d.jpg"\n        }\n      },\n      "features":[\n        {\n          "type":"TEXT_DETECTION",\n          "maxResults":1\n        }\n      ]\n    }\n  ]\n}'
  };
  //Google Cloud Vision Request
  request(options, function(error, response, body) {
    if (error) throw new Error(error);
    try {
    var body2 = JSON.parse(body);
    console.log(body);
    var text = body2.responses[0].textAnnotations[0].description;
    console.log(text);
    var parsed = parseModel(text);
    console.log(parsed[0]);
    res.send(parsed[0]);
    }
    catch(err) {
      console.log(err);
      res.send("Unable to read model number");
  }
  });

});

// module.exports = {
// //Parse image recognition output into model & serial.
//    function parseModel(imgTxt)
// {
//     return imgTxt.match(/\S{3}-\S{5}\n\d{7}/);
// }
// };
// setup server
var server = app.listen(1337);