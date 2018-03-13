"use strict";
exports.__esModule = true;
//module.exports = {
//Parse image recognition output into model & serial.
function parseModel(imgTxt) {
    return imgTxt.match(/\S{3}-\S{5}\n\d{7}/ || /\S{3}-\S{4}\n\d{7}/);
}
exports.parseModel = parseModel;
//};
