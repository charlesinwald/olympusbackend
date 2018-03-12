//module.exports = {
 //Parse image recognition output into model & serial.
export function parseModel(imgTxt){
    return imgTxt.match(/\S{3}-\S{5}\n\d{7}/);
}
//};
