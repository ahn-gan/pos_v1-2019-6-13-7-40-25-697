const Main = require('./main/main');
const Api = require('./test/fixtures');

const loadPromotions = Api.loadPromotions;

const decodeBarcodes = Main.decodeBarcodes;

const renderReceipt = Main.renderReceipt;

const printReceipt = Main.printReceipt;

const combineItems = Main.combineItems;

const decodeTags = Main.decodeTags;

const promoteReceiptItems = Main.promoteReceiptItems;

const calculateReceiptItems = Main.calculateReceiptItems;

const calculateReceiptTotal = Main.calculateReceiptTotal;

const calculateReceiptSaving = Main.calculateReceiptSaving;

const calculateReceipt = Main.calculateReceipt;

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

it('should return receiptItems when given items and promotions', () => {
    const promotions = loadPromotions();

    const items = [
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

    const expectResult = [
        {
            "barcode": "ITEM000001",
            "name": "雪碧",
            "unit": "瓶",
            "price": 3,
            "count": 5,
            "subtotal": 12.00.toFixed(2),
        },
        {
            "barcode": "ITEM000003",
            "name": "荔枝",
            "unit": "斤",
            "price": 15,
            "count": 2.5,
            "subtotal": 37.50.toFixed(2),
        },
        {
            "barcode": "ITEM000005",
            "name": "方便面",
            "unit": "袋",
            "price": 4.5,
            "count": 3,
            "subtotal": 9.00.toFixed(2),
        }
    ];

    expect(JSON.stringify(promoteReceiptItems(items, promotions))).toBe(JSON.stringify(expectResult));
    // expect(promoteReceiptItems(items, promotions)).toStrictEqual(expectResult);
});

it('should return receiptItems when given items and items', () => {

    const items = [
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

    const expectResult = [
        {
            "barcode": "ITEM000001",
            "name": "雪碧",
            "unit": "瓶",
            "price": 3,
            "count": 5,
            "subtotal": 12.00.toFixed(2),
        },
        {
            "barcode": "ITEM000003",
            "name": "荔枝",
            "unit": "斤",
            "price": 15,
            "count": 2.5,
            "subtotal": 37.50.toFixed(2),
        },
        {
            "barcode": "ITEM000005",
            "name": "方便面",
            "unit": "袋",
            "price": 4.5,
            "count": 3,
            "subtotal": 9.00.toFixed(2),
        }
    ];

    expect(JSON.stringify(calculateReceiptItems(items))).toBe(JSON.stringify(expectResult));
});

it('should return total when given receiptItems', () => {

    const receiptItems = [
        {
            "barcode": "ITEM000001",
            "name": "雪碧",
            "unit": "瓶",
            "price": 3,
            "count": 5,
            "subtotal": 12.00,
        },
        {
            "barcode": "ITEM000003",
            "name": "荔枝",
            "unit": "斤",
            "price": 15,
            "count": 2.5,
            "subtotal": 37.50,
        },
        {
            "barcode": "ITEM000005",
            "name": "方便面",
            "unit": "袋",
            "price": 4.5,
            "count": 3,
            "subtotal": 9.00,
        }
    ];

    expect(calculateReceiptTotal(receiptItems)).toBe(58.50);
});

it('should return saving when given receiptItems', () => {

    const receiptItems = [
        {
            "barcode": "ITEM000001",
            "name": "雪碧",
            "unit": "瓶",
            "price": 3,
            "count": 5,
            "subtotal": 12.00,
        },
        {
            "barcode": "ITEM000003",
            "name": "荔枝",
            "unit": "斤",
            "price": 15,
            "count": 2.5,
            "subtotal": 37.50,
        },
        {
            "barcode": "ITEM000005",
            "name": "方便面",
            "unit": "袋",
            "price": 4.5,
            "count": 3,
            "subtotal": 9.00,
        }
    ];

    expect(calculateReceiptSaving(receiptItems)).toBe(7.50);
});


it('should return receipt when given receiptItems', () => {

    const receiptItems = [
        {
            "barcode": "ITEM000001",
            "name": "雪碧",
            "unit": "瓶",
            "price": 3,
            "count": 5,
            "subtotal": 12.00,
        },
        {
            "barcode": "ITEM000003",
            "name": "荔枝",
            "unit": "斤",
            "price": 15,
            "count": 2.5,
            "subtotal": 37.50,
        },
        {
            "barcode": "ITEM000005",
            "name": "方便面",
            "unit": "袋",
            "price": 4.5,
            "count": 3,
            "subtotal": 9.00,
        }
    ];

    const receipt = {
        "receiptItems": [
            {
                "barcode": "ITEM000001",
                "name": "雪碧",
                "unit": "瓶",
                "price": 3,
                "count": 5,
                "subtotal": 12.00,
            },
            {
                "barcode": "ITEM000003",
                "name": "荔枝",
                "unit": "斤",
                "price": 15,
                "count": 2.5,
                "subtotal": 37.50,
            },
            {
                "barcode": "ITEM000005",
                "name": "方便面",
                "unit": "袋",
                "price": 4.5,
                "count": 3,
                "subtotal": 9.00,
            }
        ],
        "total": 58.50,
        "saving": 7.50
    };

    expect(JSON.stringify(calculateReceipt(receiptItems))).toBe(JSON.stringify(receipt));
    expect(calculateReceipt(receiptItems)).toStrictEqual(receipt);
});

it('should return render receipt when given receipt', () => {

    const receipt = {
        "receiptItems": [
            {
                "barcode": "ITEM000001",
                "name": "雪碧",
                "unit": "瓶",
                "price": 3,
                "count": 5,
                "subtotal": 12.00,
            },
            {
                "barcode": "ITEM000003",
                "name": "荔枝",
                "unit": "斤",
                "price": 15,
                "count": 2.5,
                "subtotal": 37.50,
            },
            {
                "barcode": "ITEM000005",
                "name": "方便面",
                "unit": "袋",
                "price": 4.5,
                "count": 3,
                "subtotal": 9.00,
            }
        ],
        "total": 58.50,
        "saving": 7.50
    };

    const expectText = `***<没钱赚商店>收据***
名称：雪碧，数量：5瓶，单价：3.00(元)，小计：12.00(元)
名称：荔枝，数量：2.5斤，单价：15.00(元)，小计：37.50(元)
名称：方便面，数量：3袋，单价：4.50(元)，小计：9.00(元)
----------------------
总计：58.50(元)
节省：7.50(元)
**********************`;
    expect(renderReceipt(receipt)).toBe(expectText);
});

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
// end
