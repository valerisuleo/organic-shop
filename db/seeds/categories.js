const { collectionVegetable } = require("./vegetables");
const { collectionBread } = require("./bread");

let collection = [
    {
        categoryName: 'Bread',
        isActive: false,
        path: '',
        collectionSize: collectionBread.length
    },
    {
        categoryName: 'Dairy',
        isActive: false,
        path: '',
        collectionSize: 0
    },
    {
        categoryName: 'Fruits',
        isActive: false,
        path: '',
        collectionSize: 0
    },
    {
        categoryName: 'Seasoning and Spice',
        isActive: false,
        path: '',
        collectionSize: 0
    },
    {
        categoryName: 'Vegetables',
        isActive: false,
        path: '',
        collectionSize: collectionVegetable.length
    },
];

const nestedCollection = [
    collectionBread,
    collectionVegetable
];

module.exports = {
    collection,
    nestedCollection
}
