var assert = require('assert'); 
//import {parseModel} from './parse.js';
var index = require('../parse');
describe('Array', function() {
  describe('#indexOf()', function() {
    it('should return -1 when the value is not present', function() {
      assert.equal([1,2,3].indexOf(4), -1);
    });
  });
});
describe('Testing Parsing', function() {
  describe('Parse Model Number', function() {
    it('Should return only the model number', function(){
      var string = "EVIS EXERA III OLYMPUS GIF-HQ190\n2200687";
      //console.log("TEXT :" + string);
      console.log(index.parseModel(string)[0]);
      assert.equal(index.parseModel(string), "GIF-HQ190\n2200687");
    })
  })
})
