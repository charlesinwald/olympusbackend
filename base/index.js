

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
  console.log(sampleFile);
  var mv = require('mv');

  //Use the mv() method to place the file somewhere on your server
  sampleFile.mv('/home/cabox/workspace/base/c.jpg', function(err) {
    if (err){
      return res.status(500).send("Line 108 " + err);
    }});
    //res.send('File uploaded!');
  
});
// setup server
var server = app.listen(1337);