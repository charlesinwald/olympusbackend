var express = require('express'),
  app = express(),
  path = require('path'),
  less = require('less-middleware');
const fileUpload = require('express-fileupload');

var multer = require('multer')
var upload = multer({
  dest: 'uploads/'
})

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


//Prints the current path
function currentPath(req) {
  console.log(req.originalUrl); // '/admin/new'
  console.log(req.baseUrl); // '/admin'
  console.log(req.path); // '/new'
}

// serve static content
app.use(express.static(path.join(__dirname, 'public')));

//Sets up the admin route
app.use('/admin', function(req, res, next) { // GET 'http://www.example.com/admin/new'
  currentPath(req);
  res.send(myDateTime());
  next();
});
app.use('/image', function(req, res) {
  var fs = require('fs');
  var image = fs.readFileSync('/home/cabox/workspace/base/d.jpg');
  res.send(image);
});
app.post('/database', function(req, res) {
  res.send('POST request to homepage');
  var x = req.body;
  console.log(x);
  console.log(x.x);
  console.log("RES:" + res.responseText);
});


app.use(fileUpload());
app.post('/upload', function(req, res) {
  if (!req.files)
    return res.status(400).send('No files were uploaded.');

  // The name of the input field (i.e. "sampleFile") is used to retrieve the uploaded file
  let sampleFile = req.files.sampleFile;
  var x = req.body;
  console.log("body " + x);
  console.log(sampleFile);
  var mv = require('mv');
  var fs = require('fs');

  //Use the mv() method to place the file somewhere on your server
  sampleFile.mv('/home/cabox/workspace/base/d.jpg', function(err) {
    if (err) {
      return res.status(500).send("Line 108 " + err);
    }
  });
  var imageAsBase64 = fs.readFileSync('/home/cabox/workspace/base/d.jpg');
  var encoded = new Buffer(imageAsBase64).toString('base64');
  console.log("ENCODED: " + encoded);
  console.log(typeof sampleFile);
  //   var request = require("request");
  var filename = '/home/cabox/workspace/base/d.jpg';
  //   var options = {
  //     method: 'POST',
  //     url: 'https://vision.googleapis.com/v1/images:annotate',
  //     qs: {
  //       key: 'AIzaSyAWgZFieZJBX0ImbMmOuT9GKeLiiPJnfmo'
  //     },
  //     headers: {
  //       'Postman-Token': 'b294a5c1-0cae-4ec9-bca4-d94e5f07a17e',
  //       'Cache-Control': 'no-cache',
  //       'Content-Type': 'application/json'
  //     },
  //     body: {
  //       requests: [{
  //         image: {
  //           //           source: {
  //           //              gcsImageUri: 'gs://cinwald-bucket/IMG_0178.jpg'
  //           //           }
  //           source: {
  //             imageUri: "http://olympus-cci219706483.codeanyapp.com:1337/image/"
  //           }
  //           //           content: "x"
  //         },
  //         features: [{
  //           type: 'TEXT_DETECTION',
  //           maxResults: 10
  //         }]
  //       }]
  //     },
  //     json: true
  //   };
  //   options.body.requests[0].image.content = fs.readFileSync(filename).toString('base64');

  //   console.log("CONTENT:" + options.body.requests[0].image.content);
  //   console.log("BASE64" + sampleFile.toString('base64'));
  //   var JSONrequests = options.body.requests;
  // //   var JSONimage = JSONrequests[0].image.source.gcsImageUri;
  //   console.log("JSONrequests " + JSONrequests);
  //   JSONimage = "x";
  //   console.log("JSONimage " +JSONimage);

  //   console.log(JSONrequests[0].image.source.gcsImageUri);


  //   request(options, function(error, response, body) {
  //     if (error) throw new Error(error);
  //     //console.log(body);
  //     var text = body.responses[0].textAnnotations[0].description;
  //     console.log(text);
  //     //res.send(text);
  //     res.send(body);
  //   });

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
    body: '{\n  "requests":[\n    {\n      "image":{\n        "source":{\n          "imageUri":\n            "http://olympus-cci219706483.codeanyapp.com:1337/image/d.jpg"\n        }\n      },\n      "features":[\n        {\n          "type":"TEXT_DETECTION",\n          "maxResults":1\n        }\n      ]\n    }\n  ]\n}'
  };

  request(options, function(error, response, body) {
    if (error) throw new Error(error);
    console.log(body);
//     var text = body.responses[0].textAnnotations[0].description;

//     console.log(text);
    res.send(body);
  });

});

//Parse image recognition output into model & serial.
function parse(imgTxt){
  var parsedText = imgTxt.match(/\S{3}-\S{4}\n\d{7}/).split("");
}
// setup server
var server = app.listen(1337);