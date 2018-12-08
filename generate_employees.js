const mongoClient = require('mongodb').MongoClient;
const url = "mongodb://localhost:27017/";
const db_name = 'contracts_and_employees';

const collection_name = 'employees';

const Fakerator = require("fakerator");
const russian_fakerator = Fakerator("ru-RU");

const number_of_employees = 5;

const faker = require('faker');

const rn = require('random-number');

const options = {
    min: 0,
    max: 1000,
};

var employees= [];

for(var i=0;i<number_of_employees;i++){

    words = russian_fakerator.names.nameM().split(' ');

    if (words.length!=3){
        words.push('Иванов');
    }

    var image = faker.image.avatar();
    console.log(image);

    employe = {
        'surname':words[0],
        'name':words[1],
        'patronymic':words[2],
        'avatar': image
    };

    employees.push(employe);
}

mongoClient.connect(url, function (err, dbo) {
    if (err) throw err;
    db = dbo.db(db_name);

    // db.collection(collection_name).drop(function(err, delOK) {
    //     if (err) throw err;
    //     if (delOK) console.log("Collection deleted");
    //     dbo.close();
    // });


    db.collection(collection_name).insertMany(employees, function (err,res) {
        if (err) throw err;
        console.log("Number of employees inserted: " + res.insertedCount);
        db.collection(collection_name).find({}).toArray(function(err, result) {
            if (err) throw err;
            console.log(result);
        });
        dbo.close();
    });
});
