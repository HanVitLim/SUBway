const express = require('express');
const router = express.Router();
const upload = require('./fileupload');
const multer = require('multer');
const apiuse = require('./apiUse');

// Router
router.post("/", (req, res, next) => {
 upload(req, res, (err) => {
   if (err instanceof multer.MulterError) {
     return next(err);
   } else if (err) {
    return next(err);
   }
  apiuse(req.file.filename, function(result){
    
    res.json(result);
    console.log("uplaod : " + JSON.stringify(result));
    
   });
   

   console.log('원본파일명 : ' + req.file.originalname);
   console.log('저장파일명 : ' + req.file.filename);
   console.log('크기 : ' + req.file.size);
   console.log('path : ' + req.file.path + "\n");

 });
});

module.exports = router;
