const express = require('express');
const app = express();

const employees_collection_name = 'employees';
const files_collection_name = 'files';
const contracts_collection_name = 'contracts';

const employees_and_contracts_collection_name = 'employees_and_contracts';

const uid = require('uid');

app.listen(3000, function () {
    console.log('Listenning on port 3001!');
});

var mongoClient = require('mongodb').MongoClient;
var url = "mongodb://localhost:27017/";
var db_name = 'contracts_and_employees';

var path_to_files =__dirname+'/files/';

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

app.get('/api/mobile/objects', function (req,res) {
    var userId = req.get('userId');


});

app.post('/api/mobile/:objectId/attaches', function (req, res) {
    var body = req.body;

    res.send('123');
});

app.get('/api/employees_and_tasks',function (req, res) {
    mongoClient.connect(url, function(err, dbo) {
        if (err) throw err;
        const db = dbo.db(db_name);

        db.collection(employees_and_contracts_collection_name).find({}).toArray(function(err, employees_and_contracts) {
            if (err) throw err;

            // console.log(employees_and_contracts);
            db.collection(contracts_collection_name).find({}).toArray(function(err, contracts) {
                if (err) throw err;

                var contracts_and_employee = contracts.map(function (contract) {
                    // var newContract = {};
                    // for(var i=0; i<employees_and_contracts.length; i++){
                    //     if (employees_and_contracts[i]['tasks'].includes(contract['id'])){
                    //         console.log(employees_and_contracts[i]);
                    //         newContract['employee_id'] = employees_and_contracts[i]['id'];
                    //         newContract['latitude'] = contract['latitude'];
                    //         newContract['longtitude'] = contract['longtitude'];
                    //         return newContract;
                    //     }
                    // }
                    const contractId = contract.id;
                    console.log(contractId, employees_and_contracts);
                    const employeeData = employees_and_contracts.find((item) =>  item.tasks.includes(contractId));
                    console.log(employeeData);
                    const employeeId = employeeData.employee_id;
                    return {
                        lat: contract.latitude,
                        lng: contract.longtitude,
                        employeeId
                    }
                });
                dbo.close();
                console.log(contracts_and_employee);
                res.send(contracts_and_employee);

            });
        });
    });
});


app.get('/api/mobile/{objectId}/attaches ', function (req, res) {
    var userId = req.get('userId');

    var dir = __dirname+'files'
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