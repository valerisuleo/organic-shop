const firebase = require("firebase");
// Required for side-effects
require("firebase/firestore");

const firestore = require('./actions');
const vegetables = require('./seeds/vegetables');
const categories = require("./seeds/categories");
const bread = require("./seeds/bread");

// Initialize Cloud Firestore through Firebase
firebase.initializeApp({
    apiKey: "AIzaSyCOqWcUyqJnHKxdXlZluXoYoWkpabbTbdA",
    authDomain: "ng-mosh-project.firebaseapp.com",
    projectId: "ng-mosh-project",
});

const db = firebase.firestore();


const categoriesPayload = {
    db: db,
    collection: categories.collection,
    collectionPath: 'categories',
    nestedCollectionPath: ['bread', 'vegetables'],
    nestedCollection: categories.nestedCollection,
    nestedCollectionParentIndex: [0, 4]
};


firestore.populate(categoriesPayload);


// UPLOAD TO FIRESTORE
// collections.push(coursePayload, categoriesPayload, breadPayload);
// collections.forEach((payloadCollection) => {
//     firestore.populate(payloadCollection);
// });







