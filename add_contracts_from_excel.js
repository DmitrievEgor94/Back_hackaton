const XLSX = require('xlsx');
const rn = require('random-number');

const mongoClient = require('mongodb').MongoClient;
const url = "mongodb://localhost:27017/";
const db_name = 'contracts_and_employees';

const collection_name = 'contracts';

const workbook = XLSX.readFile('table.xlsx');
const sheet_name_list = workbook.SheetNames;
let contracts = XLSX.utils.sheet_to_json(workbook.Sheets[sheet_name_list[0]]);
const uid = require('uid');

console.log(contracts);

const key_mapper =
    {'Номер контракта':'number of contract',
     'Предмет проверки':'subject of contract',
     'Адрес объекта':'address of object',
     'Широта':'latitude',
     'Долгота':'longtitude',
     'Стоимость объекта проверки':'price',
     'Предмет проверки':'subject of contract',
     'Заказчик':'customer',
     'Наличие замечаний':'problems',
     'Дата завершения контракта':'deadline'
};

var newContracts = contracts.map(function (contract) {
    let newContract = {};

    newContract['id'] = uid();

    for (const key in key_mapper){
        if (key == 'Дата завершения контракта')
             newContract[key_mapper[key]] = new Date(1900, 0, contract[key] - 1);
        else  newContract[key_mapper[key]] = contract[key];
    }

    return newContract;
});


mongoClient.connect(url, function (err, dbo) {
    if (err) throw err;
    var db = dbo.db(db_name);

    // db.collection(collection_name).drop(function(err, delOK) {
    //     if (err) throw err;
    //     if (delOK) console.log("Collection deleted");
    //     dbo.close();
    // });
    console.log(newContracts);
    db.collection(collection_name).insertMany(newContracts, function (err,res) {
        if (err) throw err;
        console.log("Number of documents inserted: " + res.insertedCount);
        db.collection(collection_name).find({}).toArray(function(err, result) {
            if (err) throw err;
            console.log(result);
            dbo.close();
        });
    });
});
