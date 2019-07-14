'use strict';


const Api = require('../test/fixtures');

const loadAllItems = Api.loadAllItems;

const loadPromotions = Api.loadPromotions;

const decodeBarcodes = (tags) => {
    let barcodeMap = new Map();
    tags.forEach(tag => {
        let count;
        if (tag.indexOf('-') > -1) {
            // 分割条码和数量
            let tagStrings = tag.split('-');
            count = barcodeMap.get(tagStrings[0]) === undefined ? parseFloat(tagStrings[1]) : barcodeMap.get(tagStrings[0]) + parseFloat(tagStrings[1]);
            barcodeMap.set(tagStrings[0], count);
        } else {
            count = barcodeMap.get(tag) === undefined ? 1 : barcodeMap.get(tag) + 1;
            barcodeMap.set(tag, count);
        }
    });
    let result = [];
    barcodeMap.forEach((value, key) => {
        let obj = {
            barcode: key,
            count: value
        };
        result.push(obj);
    });
    return result;
}

const combineItems = (decodeBarcodes) => {
    const allItems = loadAllItems();
    return decodeBarcodes.map(decodebarcode => {
        let filterItem = allItems.filter(val => {
            return val.barcode === decodebarcode.barcode;
        });
        let itemObj = filterItem[0];
        itemObj['count'] = decodebarcode.count;
        return itemObj;
    });
}

const decodeTags = (tags) => {
    return combineItems(decodeBarcodes(tags));
}

const promoteReceiptItems = (items, promotions) => {
    const promotionsBarcodes = promotions[0].barcodes;
    return items.map(item => {
        promotionsBarcodes.indexOf(item.barcode) > -1 && item.count > 2 ? item['subtotal'] = parseFloat((item.price * (item.count - parseInt(item.count / 3)))).toFixed(2) : item['subtotal'] = parseFloat((item.price * item.count)).toFixed(2)
        return item;
    });
}

const calculateReceiptItems = (items) => {
    const promotions = loadPromotions();
    return promoteReceiptItems(items, promotions);
}

const calculateReceiptTotal = (receiptItems) => {
    let totalAmount = 0;
    receiptItems.forEach(item => {
        totalAmount += parseFloat(item.subtotal);
    });
    return totalAmount;
}

const calculateReceiptSaving = (receiptItems) => {
    let saveAmount = 0;
    receiptItems.forEach(item => {
        saveAmount += item.price * item.count - item.subtotal;
    });
    return saveAmount;
}

const calculateReceipt = (receiptItems) => {
    let total = calculateReceiptTotal(receiptItems);
    let saving = calculateReceiptSaving(receiptItems);
    return {'receiptItems': receiptItems, 'total': total, 'saving': saving};
}

const renderReceipt = (receipt) => {
    let itemDetails = '***<没钱赚商店>收据***\n';
    receipt.receiptItems.forEach(item => {
        itemDetails += '名称：' + item.name + '，数量：' + item.count + item.unit + '，单价：' + item.price.toFixed(2) + '(元)，小计：' + parseFloat(item.subtotal).toFixed(2) + '(元)\n';
    });
    itemDetails += '----------------------\n';
    itemDetails += '总计：' + receipt.total.toFixed(2) + '(元)\n节省：' + receipt.saving.toFixed(2) + '(元)\n';
    itemDetails += '**********************';
    return itemDetails;
}

const printReceipt = (tags) => {
    let items = decodeTags(tags);
    let receiptItems = calculateReceiptItems(items);
    let receipt = calculateReceipt(receiptItems);
    return renderReceipt(receipt);
};

module.exports = {
    decodeBarcodes,
    combineItems,
    decodeTags,
    promoteReceiptItems,
    calculateReceiptItems,
    calculateReceiptTotal,
    calculateReceiptSaving,
    calculateReceipt,
    renderReceipt,
    printReceipt
};
