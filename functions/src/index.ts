import * as functions from 'firebase-functions';
import { db } from './init';

function categoryTransaction(snap: any, cb: Function) {
    return db.runTransaction(async (transaction: any) => {

        const categoryRef = snap.ref.parent.parent;
        const categorySnap = await transaction.get(categoryRef);
        const category = categorySnap.data();
        const changes = cb(category);

        transaction.update(categoryRef, changes);
    });
}

const onAddItemToSubCategory = functions.firestore
    .document('categories/{categoryId}/{subCategory}/{subCategoryId}')
    .onCreate(async (snap, context) => {
        return categoryTransaction(snap, (category: any) => {
            return { collectionSize: category.collectionSize + 1 }
        });
    });

const onDeleteItemToSubCategory = functions.firestore
    .document('categories/{categoryId}/{subCategory}/{subCategoryId}')
    .onDelete(async (snap, context) => {
        return categoryTransaction(snap, (category: any) => {
            return { collectionSize: category.collectionSize - 1 }
        });
    });


export default {
    onAdd: onAddItemToSubCategory,
    onDelete: onDeleteItemToSubCategory,
};