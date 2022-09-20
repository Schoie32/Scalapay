const axios = require('axios').default;

class PaymentType {
    constructor(paymentType) {
        this.type = paymentType.type;
        this.product = paymentType.product;
        this.frequency = paymentType.frequency;
        this.minimumAmount = paymentType.configuration.minimumAmount
        this.maximumAmount = paymentType.configuration.maximumAmount
    }
}

function printCSV(paymentTypes, headers){
    let csvData = getObjectDataByHeader(paymentTypes, headers);
    
    outputString = "";
    csvData.forEach(function(rowData){
        let row = rowData.join(",");
        outputString += row + "\r\n";
    });
    
    return outputString;
}

function getObjectDataByHeader(objectArray, headers){
    const csvArray = [];
    csvArray.push(Object.keys(headers));

    //iterating through each object in the input stream
    for(const paymentTypeObject of Object.values(objectArray)){
        let rowData = [];
        //iterating through each element of the object in the input stream
        for (const [key, value] of Object.entries(paymentTypeObject)){
            if(Object.keys(headers).includes(key)){
                rowData.push(getObjectData(value, headers, key));
            }
        }
        csvArray.push(rowData);
    }
    return csvArray;
}

function getObjectData(object, headers, key){
    //return either the object or the value using the object as a key.
    //ie for 'product', we want to return the object as it already contains the value.
    //for minimumAmount, we want to find the amount & therefore need to use the amount key on the minimumAmount object to find the dollar value.
    //Ideally this function would be recursive such that it would infinitely look for the root value from nested objects. This would make it follow
    //the principal of 'tell dont ask'
    object[headers[key]] ? dataFromKey = object[headers[key]] : dataFromKey = object;
    return dataFromKey;
}

axios.get("https://integration.api.scalapay.com/v3/configurations",{
    headers: {
        'Authorization': 'Bearer qhtfs87hjnc12kkos'
    }
}).then(
    function (response){
        const paymentTypes = [];
        for (const dataValue of response.data){
            paymentTypes.push(new PaymentType(dataValue));
        }
        const csvMessage = printCSV(paymentTypes, {'product':null, 'type':null, 'minimumAmount': 'amount', 'maximumAmount': 'amount'});
        console.log(csvMessage);
    }
)