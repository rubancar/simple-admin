const xls = require('xlsx');

function groupBy(array, key) {
    return array.reduce(function(rv, x) {
        (rv[x[key]] = rv[x[key]] || []).push(x);
        return rv;
    }, {});
}

/**
 *
 * @param {Object} sheetsData Object with sheetsData
 * @param {string} dataType It could be one of the following data types
 * https://github.com/SheetJS/sheetjs#output-type
 */
function generateXLSX(sheetsData, dataType = 'base64') {
    let workbook = { SheetNames: [], Sheets: {} }

    workbook.Props = {
        Title: 'Workbook',
        Subject: '',
        Author: 'Shippify Inc.',
        Company: 'Shippify Inc.',
        CreatedDate: new Date(),
    }

    for (let key in sheetsData) {
        let sheetData = sheetsData[key];
        const ws = xls.utils.json_to_sheet(sheetData.data);
        if(sheetData.colsConfig)
            ws['!cols'] = sheetData.colsConfig
        xls.utils.book_append_sheet(workbook, ws, sheetData.name);
    }

    return xls.write(workbook, {
        bookType: 'xlsx',
        type: dataType
    })
}

module.exports = {
    groupBy,
    generateXLSX
}
