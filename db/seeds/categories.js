const { collectionVegetable } = require("./vegetables");
const { collectionBread } = require("./bread");

let collection = [
    {
        categoryName: 'Bread',
        isActive: false,
        isDisable: false,
        collectionSize: collectionBread.length
    },
    {
        categoryName: 'Dairy',
        isActive: false,
        isDisable: true,
        collectionSize: 0
    },
    {
        categoryName: 'Fruits',
        isActive: false,
        isDisable: true,
        collectionSize: 0
    },
    {
        categoryName: 'Seasoning and Spice',
        isActive: false,
        isDisable: true,
        collectionSize: 0
    },
    {
        categoryName: 'Vegetables',
        isActive: false,
        isDisable: false,
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
