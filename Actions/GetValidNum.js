const Tesseract = require('tesseract.js');
const fs = require('fs');

async function GetValidNum(imagePath) {
  const { data: { text } } = await Tesseract.recognize(
    imagePath,
    'eng',
  );
  fs.unlinkSync(imagePath);
  fs.unlinkSync('eng.traineddata');
  return text;
}

module.exports = GetValidNum;