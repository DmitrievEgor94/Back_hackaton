const mongoClient = require('mongodb').MongoClient;
const url = "mongodb://localhost:27017/";
const db_name = 'contracts_and_employees';

const employees_collection_name = 'employees';
const contracts_collection_name = 'contracts';
const kmeans = require('node-kmeans');

const contracts_and_employees_collection_name = 'employees_and_contracts';

const uid = require('uid');

mongoClient.connect(url, function (err, dbo) {
    if (err) throw err;
    db = dbo.db(db_name);


    db.collection(employees_collection_name).find({}).toArray(function (err, employee_collection) {
        if (err) throw err;
        db.collection(contracts_collection_name).find({}).toArray(function (err, contracts_collection) {
            if (err) throw err;

            var points = contracts_collection.map(function (element) {
                return [element['longtitude'], element['latitude']];
            });
            console.log(points);
            kmeans.clusterize(points, {k: employee_collection.length}, (err, arrayOfClusters) => {
                if (err) console.error(err);

                employee_collection.forEach(function (employee) {

                    var distance = function (point1, point_2) {
                        return Math.pow(point1[0] - point_2[0], 2) + Math.pow(point1[1] - point_2[1], 2);
                    };

                    var min_distance = 1000000000.0;
                    var min_cluster = 0;

                    for (var i = 0; i < arrayOfClusters.length; i++) {
                        var new_distance = distance(arrayOfClusters[i]['centroid'], [employee['longtitude'], employee['latitude']]);
                        if ((new_distance < min_distance) && (!arrayOfClusters[i].hasOwnProperty('Назначен'))) {
                            min_distance = new_distance;
                            min_cluster = i;
                        }
                    }
                    employee['tasks'] = arrayOfClusters[min_cluster]['clusterInd'];
                    arrayOfClusters[min_cluster]['Назначен'] = 'Да';
                });

                employee_collection.forEach(function (worker) {
                    var clusterInd = worker['tasks'];

                    var contracts = [];

                    for (var i = 0; i < clusterInd.length; i++) {
                        contracts.push(contracts_collection[clusterInd[i]]);
                    }

                    worker['tasks'] = contracts.map(function (contract) {
                        return contract['_id'];
                    });
                });

                var employees_and_contracts = employee_collection.map(function (worker) {
                    var object = {'id': uid(), 'employee_id': worker['id'], 'tasks': worker['tasks']};
                    return object;
                });

                db.collection(contracts_and_employees_collection_name).drop(function (err, delOK) {
                    db.collection(contracts_and_employees_collection_name).insertMany(employees_and_contracts, function (err, res) {
                        if (err) throw err;
                        console.log("Tasks and workers are made: " + res.insertedCount);
                        db.collection(contracts_and_employees_collection_name).find({}).toArray(function (err, result) {
                            if (err) throw err;
                            console.log(result);

                            dbo.close();
                        });
                    });
                });
            });
        });
    });

});