const multer = require('multer'); 
const fs = require('fs');
// multer-optional

const imagesDir = './image';
if (!fs.existsSync(imagesDir)){
  fs.mkdirSync(imagesDir, {recursive: true});
}

var storage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, imagesDir);
    },
    filename: (req, file, cb) => {
      cb(null, `${Date.now()}_${file.originalname}`);
    },
   });
// https://curryyou.tistory.com/465 
   var upload = multer({ storage: storage }).single("userfile");
   
   
module.exports = upload;