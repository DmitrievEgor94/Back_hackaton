var express = require('express');
var app = express();
const employees_collection_name = 'employees';

app.listen(3000, function () {
    console.log('Listenning on port 3000!');
});


var mongoClient = require('mongodb').MongoClient;
var url = "mongodb://localhost:27017/";
var db_name = 'contracts_and_employees';

var autoIncrement = require("mongodb-autoincrement");

app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

// app.get('/api/contracts',function (req, res) {
//     var userId = req.get('userId')
//     // MongoClient.connect(url, function(err, db) {
//     //     if (err) throw err;
//     //     const db = client.db(db_name);
//     //
//     // });
//     // res.send('zer good')
// });

app.get('/api/employees',function (req,res) {
    mongoClient.connect(url, function(err, dbo) {
        if (err) throw err;
        const db = dbo.db(db_name);

        db.collection(employees_collection_name).find({}).toArray(function(err, result) {
            if (err) throw err;
            console.log(result);
            res.send(result);
        });
        dbo.close();

    });
});

// app.get('/api/contracts/get_all',function (req, res) {
//     var userId = req.get('userId')
//     MongoClient.connect(url, function(err, client) {
//         if (err) throw err;
//         const db = client.db(db_name);
//
//     });
//     res.send('zer good')
// });


// app.post('/api/contracts',function (req, res) {
//     body = req.query;
//
//     collectionName = 'contracts';
//
//     autoIncrement.getNextSequence(db, collectionName, function (err, autoIndex) {
//         var collection = db.collection(collectionName);
//
//         body['_id'] = autoIndex
//
//         collection.insert({
//             body
//         });
//     });
//
//     res.send('zer good')
// });