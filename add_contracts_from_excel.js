const XLSX = require('xlsx');
const rn = require('random-number');

const mongoClient = require('mongodb').MongoClient;
const url = "mongodb://localhost:27017/";
const db_name = 'contracts_and_employees';

const collection_name = 'contracts';

const workbook = XLSX.readFile('constracts.xlsx');
const sheet_name_list = workbook.SheetNames;
let contracts = XLSX.utils.sheet_to_json(workbook.Sheets[sheet_name_list[0]]);

const key_mapper =
    {'Номер контракта':'Number of contract',
     'Предмет проверки':'Subject of contract',
     'Адресс объекта':'Address of object',
     'Координаты':'Coordinates',
     'Стоимость':'Price',
     'Предмет проверки':'Subject of contract',
     'Заказчик':'Provider',
     'Наличие замечаний':'Problems'
};

var newContracts = contracts.forEach(function (contract) {
    let newContract = [];

    for (const key in key_mapper){
        newContract[key_mapper[key]] = contract[key];

    }
    return newContract;
});

// console.log()

const options = {
    min: 0,
    max: 1000,
};


contracts.forEach(function(element) {
    delete element['№'];
    element['Position']=[rn(options),rn(options)];
    // console.log(element);
});

mongoClient.connect(url, function (err, dbo) {
    if (err) throw err;
    var db = dbo.db(db_name);

    // db.collection(collection_name).drop(function(err, delOK) {
    //     if (err) throw err;
    //     if (delOK) console.log("Collection deleted");
    //     dbo.close();
    // });

    db.collection(collection_name).insertMany(contracts, function (err,res) {
        if (err) throw err;
        console.log("Number of documents inserted: " + res.insertedCount);
        db.collection(collection_name).find({}).toArray(function(err, result) {
            if (err) throw err;
            console.log(result);
        });
        dbo.close();
    });
});
