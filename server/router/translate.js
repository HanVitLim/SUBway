var express = require('express');
const router = express.Router();
const mysql = require('mysql');

const conn = {
    host : '',
    port : '',
    user : '',
    password : '',
    database : '',
}
    router.get('/', function (req, res) {
       const resdata = req.query.data;
       console.log(resdata);

       var connection = mysql.createConnection(conn);
       connection.connect();
       var query = "select * from transName where eng in (?)";
       connection.query(query, [resdata], function(err, result, fields){
        if(err){
            console.log(err);
        }
        console.log(result);
        
        res.json(result);

       });
       connection.end();


        });
        
module.exports = router;
