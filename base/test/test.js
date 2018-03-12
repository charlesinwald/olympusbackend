var assert = require('assert'); 
var index = require('../index.ts');
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
      console.log("TEXT : EVIS EXERA III OLYMPUS GIF-HQ190 2200687")
      
    })
  })
})
