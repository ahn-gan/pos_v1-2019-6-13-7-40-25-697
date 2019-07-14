'use strict';


const Api = require('../test/fixtures');

const loadAllItems = Api.loadAllItems;

const loadPromotions = Api.loadPromotions;


const printReceipt = (tags) => {
    let barcodeMap = decodeBarcodes(tags);
    let itemList = handleMapToItemList(barcodeMap);
    let receipt = renderReceipt(itemList);
    // console.log(receipt);
    return receipt;
};

const decodeBarcodes = (tags) => {
    let barcodeMap = new Map();
    tags.forEach(tag => {
        let count;
        if (tag.indexOf('-') > -1) {
            // 分割条码和数量
            let tagStrings = tag.split('-');
            count = barcodeMap.get(tagStrings[0]) == undefined ? parseFloat(tagStrings[1]) : barcodeMap.get(tagStrings[0]) + parseFloat(tagStrings[1]);
            barcodeMap.set(tagStrings[0], count);
        } else {
            count = barcodeMap.get(tag) == undefined ? 1 : barcodeMap.get(tag) + 1;
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


const handleMapToItemList = (barcodeMap) => {
    const allItems = loadAllItems();
    let itemList = [];
    barcodeMap.forEach((value, key) => {
        let filterItem = allItems.filter(val => {
            return val.barcode == key;
        });
        let itemObj = filterItem[0];
        // itemObj['subAmount'] = filterItem[0].price * value;
        itemObj['count'] = value;
        itemList.push(itemObj);
    });
    return itemList;
}

const handleItemAmount = (itemList, promotionsDetail) => {
    const promotionsBarcodes = promotionsDetail[0].barcodes;
    itemList.forEach(item => {

        if (promotionsBarcodes.indexOf(item.barcode) > -1 && item.count > 2) {
            // 买二送一
            item['subAmount'] = (item.price * (item.count - parseInt(item.count / 3))).toFixed(2);
        } else {
            // 原价
            item['subAmount'] = (item.price * item.count).toFixed(2);
        }
    });
    return itemList;
}

const calculateTotalAmount = (itemList) => {
    let totalAmount = 0;
    itemList.forEach(item => {
        totalAmount += parseFloat(item.subAmount);
    });
    return totalAmount.toFixed(2);
}

const calculateSaveAmount = (itemList) => {
    let saveAmount = 0;
    itemList.forEach(item => {
        saveAmount += item.price * item.count - item.subAmount;
    });
    return saveAmount.toFixed(2);
}

const renderItemDetail = (itemList) => {
    let itemDetails = '';
    itemList.forEach(item => {
        itemDetails += '名称：' + item.name + '，数量：' + item.count + item.unit + '，单价：' + item.price.toFixed(2) + '(元)，小计：' + item.subAmount + '(元)\n';

    });
    return itemDetails;
}

const renderTotalDetail = (totalAmount, saveAmount) => {
    return '总计：' + totalAmount + '(元)\n节省：' + saveAmount + '(元)';
}

const renderReceipt = (itemList) => {
    let receipt = '***<没钱赚商店>收据***\n';
    const promotionsDetail = loadPromotions();

    let detailItemList = handleItemAmount(itemList, promotionsDetail);
    let totalAmount = '' + calculateTotalAmount(detailItemList);
    let saveAmount = '' + calculateSaveAmount(detailItemList);
    let itemDetails = renderItemDetail(detailItemList);
    let totalDetails = renderTotalDetail(totalAmount, saveAmount);
    receipt += itemDetails;
    receipt += '----------------------\n';
    receipt += totalDetails;
    receipt += '\n**********************';
    return receipt;
}


module.exports = {
    decodeBarcodes,
    combineItems,
    decodeTags,
    handleMapToItemList,
    handleItemAmount,
    calculateTotalAmount,
    calculateSaveAmount,
    renderItemDetail,
    renderTotalDetail,
    renderReceipt,
    printReceipt
};
