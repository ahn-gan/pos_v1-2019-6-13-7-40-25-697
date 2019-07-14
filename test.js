const Main = require('./main/main');
const Api = require('./test/fixtures');

// const loadAllItems = Api.loadAllItems;

const loadPromotions = Api.loadPromotions;

const decodeBarcodes = Main.decodeBarcodes;

const handleMapToItemList = Main.handleMapToItemList;

const handleItemAmount = Main.handleItemAmount;

const calculateTotalAmount = Main.calculateTotalAmount;

const calculateSaveAmount = Main.calculateSaveAmount;

const renderItemDetail = Main.renderItemDetail;

const renderTotalDetail = Main.renderTotalDetail;

const renderReceipt = Main.renderReceipt;

const printReceipt = Main.printReceipt;

const combineItems = Main.combineItems;

const decodeTags = Main.decodeTags;


// test for function isStartSmallerThanOrEqualToEnd

// pass

it('should return decodedBarcodes when given barcodes', () => {
    const tags = [
        'ITEM000001',
        'ITEM000001',
        'ITEM000001',
        'ITEM000001',
        'ITEM000001',
        'ITEM000003-2.5',
        'ITEM000005',
        'ITEM000005-2',
    ];
    let expectResult = [{"barcode": "ITEM000001", "count": 5}, {
        "barcode": "ITEM000003",
        "count": 2.5
    }, {"barcode": "ITEM000005", "count": 3}];
    expect(JSON.stringify(decodeBarcodes(tags))).toBe(JSON.stringify(expectResult));
});

it('should return items when given decodedBarcodes', () => {
    let decodedBarcodes = [
        {"barcode": "ITEM000001", "count": 5},
        {"barcode": "ITEM000003", "count": 2.5},
        {"barcode": "ITEM000005", "count": 3}
        ];

    let expectResult = [
        {
            "barcode": "ITEM000001",
            "name": "雪碧",
            "unit": "瓶",
            "price": 3,
            "count": 5,
        },
        {
            "barcode": "ITEM000003",
            "name": "荔枝",
            "unit": "斤",
            "price": 15,
            "count": 2.5,
        },
        {
            "barcode": "ITEM000005",
            "name": "方便面",
            "unit": "袋",
            "price": 4.5,
            "count": 3,
        }
    ];
    expect(JSON.stringify(combineItems(decodedBarcodes))).toBe(JSON.stringify(expectResult));
    // expect(combineItems(decodedBarcodes)).toStrictEqual(expectResult);
});

// pass
it('should return items when given tags', () => {
    const tags = [
        'ITEM000001',
        'ITEM000001',
        'ITEM000001',
        'ITEM000001',
        'ITEM000001',
        'ITEM000003-2.5',
        'ITEM000005',
        'ITEM000005-2',
    ];

    const expectResult = [
        {
            "barcode": "ITEM000001",
            "name": "雪碧",
            "unit": "瓶",
            "price": 3,
            "count": 5,
        },
        {
            "barcode": "ITEM000003",
            "name": "荔枝",
            "unit": "斤",
            "price": 15,
            "count": 2.5,
        },
        {
            "barcode": "ITEM000005",
            "name": "方便面",
            "unit": "袋",
            "price": 4.5,
            "count": 3,
        }
    ];
    expect(JSON.stringify(decodeTags(tags))).toBe(JSON.stringify(expectResult));
});

// pass

it('should return itemList when given itemMap', () => {
    let itemMap = new Map();
    itemMap.set("ITEM000001", 5);
    itemMap.set("ITEM000003", 2.5);
    itemMap.set("ITEM000005", 3);

    const result = [
        {"barcode": "ITEM000001", "name": "雪碧", "unit": "瓶", "price": 3, "count": 5},
        {"barcode": "ITEM000003", "name": "荔枝", "unit": "斤", "price": 15, "count": 2.5},
        {"barcode": "ITEM000005", "name": "方便面", "unit": "袋", "price": 4.5, "count": 3}];

    expect(JSON.stringify(handleMapToItemList(itemMap))).toBe(JSON.stringify(result));
});


// pass

it('should return itemList with subAmount when given itemList', () => {
    const promotionsDetail = loadPromotions();

    const itemList = [
        {"barcode": "ITEM000001", "name": "雪碧", "unit": "瓶", "price": 3, "count": 5},
        {"barcode": "ITEM000003", "name": "荔枝", "unit": "斤", "price": 15, "count": 2.5},
        {"barcode": "ITEM000005", "name": "方便面", "unit": "袋", "price": 4.5, "count": 3}
    ];

    const expectValue = [
        {"barcode": "ITEM000001", "name": "雪碧", "unit": "瓶", "price": 3, "count": 5, "subAmount": 12.00.toFixed(2)},
        {"barcode": "ITEM000003", "name": "荔枝", "unit": "斤", "price": 15, "count": 2.5, "subAmount": 37.50.toFixed(2)},
        {"barcode": "ITEM000005", "name": "方便面", "unit": "袋", "price": 4.5, "count": 3, "subAmount": 9.00.toFixed(2)}
    ];

    expect(JSON.stringify(handleItemAmount(itemList, promotionsDetail))).toBe(JSON.stringify(expectValue));
});


// pass
it('should return totalAmount when given itemList', () => {

    const itemList = [
        {"barcode": "ITEM000001", "name": "雪碧", "unit": "瓶", "price": 3, "count": 5, "subAmount": 12.00.toFixed(2)},
        {"barcode": "ITEM000003", "name": "荔枝", "unit": "斤", "price": 15, "count": 2.5, "subAmount": 37.50.toFixed(2)},
        {"barcode": "ITEM000005", "name": "方便面", "unit": "袋", "price": 4.5, "count": 3, "subAmount": 9.00.toFixed(2)}
    ];

    expect(calculateTotalAmount(itemList)).toBe(58.5.toFixed(2));
});


// pass

it('should return saveAmount when given itemList', () => {

    const itemList = [
        {"barcode": "ITEM000001", "name": "雪碧", "unit": "瓶", "price": 3, "count": 5, "subAmount": 12.00.toFixed(2)},
        {"barcode": "ITEM000003", "name": "荔枝", "unit": "斤", "price": 15, "count": 2.5, "subAmount": 37.50.toFixed(2)},
        {"barcode": "ITEM000005", "name": "方便面", "unit": "袋", "price": 4.5, "count": 3, "subAmount": 9.00.toFixed(2)}
    ];

    expect(calculateSaveAmount(itemList)).toBe(7.5.toFixed(2));
});

// pass

it('should return itemDetails when given itemList', () => {

    const itemList = [
        {"barcode": "ITEM000001", "name": "雪碧", "unit": "瓶", "price": 3, "count": 5, "subAmount": 12.00.toFixed(2)},
        {"barcode": "ITEM000003", "name": "荔枝", "unit": "斤", "price": 15, "count": 2.5, "subAmount": 37.50.toFixed(2)},
        {"barcode": "ITEM000005", "name": "方便面", "unit": "袋", "price": 4.5, "count": 3, "subAmount": 9.00.toFixed(2)}
    ];

    const result = '名称：雪碧，数量：5瓶，单价：3.00(元)，小计：12.00(元)\n' +
        '名称：荔枝，数量：2.5斤，单价：15.00(元)，小计：37.50(元)\n' +
        '名称：方便面，数量：3袋，单价：4.50(元)，小计：9.00(元)\n';

    expect(renderItemDetail(itemList)).toBe(result);
});

// pass

it('should return totalDetails when given total and save amounts', () => {

    const result = '总计：58.50(元)\n节省：7.50(元)';

    expect(renderTotalDetail('58.50', '7.50')).toBe(result);
});


// pass
it('should return receipt when given itemList', () => {

    const itemList = [
        {"barcode": "ITEM000001", "name": "雪碧", "unit": "瓶", "price": 3, "count": 5},
        {"barcode": "ITEM000003", "name": "荔枝", "unit": "斤", "price": 15, "count": 2.5},
        {"barcode": "ITEM000005", "name": "方便面", "unit": "袋", "price": 4.5, "count": 3}
    ];
    const expectText = `***<没钱赚商店>收据***
名称：雪碧，数量：5瓶，单价：3.00(元)，小计：12.00(元)
名称：荔枝，数量：2.5斤，单价：15.00(元)，小计：37.50(元)
名称：方便面，数量：3袋，单价：4.50(元)，小计：9.00(元)
----------------------
总计：58.50(元)
节省：7.50(元)
**********************`;

    expect(renderReceipt(itemList)).toBe(expectText);
});

// pass

it('should return receipt when given barcodes', () => {

    const tags = [
        'ITEM000001',
        'ITEM000001',
        'ITEM000001',
        'ITEM000001',
        'ITEM000001',
        'ITEM000003-2.5',
        'ITEM000005',
        'ITEM000005-2',
    ];
    const expectText = `***<没钱赚商店>收据***
名称：雪碧，数量：5瓶，单价：3.00(元)，小计：12.00(元)
名称：荔枝，数量：2.5斤，单价：15.00(元)，小计：37.50(元)
名称：方便面，数量：3袋，单价：4.50(元)，小计：9.00(元)
----------------------
总计：58.50(元)
节省：7.50(元)
**********************`;

    expect(printReceipt(tags)).toBe(expectText);
});

