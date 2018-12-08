const mongoClient = require('mongodb').MongoClient;
const url = "mongodb://localhost:27017/";
const db_name = 'contracts_and_employees';

const collection_name = 'employees';

const Fakerator = require("fakerator");
const russian_fakerator = Fakerator("ru-RU");

const uid = require("uid")

const number_of_employees = 5;

const faker = require('faker');

const rn = require('random-number');

const options_latitude = {
    min: 54,
    max: 56
};

const options_longtitude={
    min: 37,
    max: 38
}
;
var employees = [];

for (var i = 0; i < number_of_employees; i++) {

    words = russian_fakerator.names.nameM().split(' ');

    if (words.length != 3) {
        words.push('Иванович');
    }

    var image = faker.image.avatar();

    var employee = {
        'id': uid(),
        'surname': words[0],
        'name': words[1],
        'patronymic': words[2],
        'avatar': image,
        'latitude':rn(options_latitude),
        'longtitude':rn(options_longtitude)
    };

    employees.push(employee);
}

mongoClient.connect(url, function (err, dbo) {
    if (err) throw err;
    db = dbo.db(db_name);

    db.collection(collection_name).drop(function(err, delOK) {
        db.collection(collection_name).insertMany(employees, function (err, res) {
            if (err) throw err;
            console.log("Number of employees inserted: " + res.insertedCount);
            db.collection(collection_name).find({}).toArray(function (err, result) {
                if (err) throw err;
                console.log(result);

                dbo.close();
            });
        });
    });

});
