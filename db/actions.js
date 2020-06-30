// _____________________________Removing Data_____________________________
function deleteCollection(db, collectionPath, batchSize) {
    let collectionRef = db.collection(collectionPath);
    let query = collectionRef.orderBy('__name__').limit(batchSize);

    return new Promise((resolve, reject) => {
        deleteQueryBatch(db, query, resolve, reject);
    });
}

function deleteQueryBatch(db, query, resolve, reject) {
    query.get()
        .then((snapshot) => {
            // When there are no documents left, we are done
            if (snapshot.size === 0) {
                return 0;
            }

            // Delete documents in a batch
            let batch = db.batch();
            snapshot.docs.forEach((doc) => {
                batch.delete(doc.ref);
            });

            return batch.commit().then(() => {
                return snapshot.size;
            });
        }).then((numDeleted) => {
            if (numDeleted === 0) {
                resolve();
                return;
            }

            // Recurse on the next process tick, to avoid
            // exploding the stack.
            process.nextTick(() => {
                deleteQueryBatch(db, query, resolve, reject);
            });
        })
        .catch(reject);
}

function removeNestedCollection(payload) {
    const collectionRef = payload.db.collection(payload.collectionPath);
    let responseWithId = [];

    collectionRef
        .get()
        .then((res) => {
            responseWithId = res.docChanges().map((el) => {
                return {
                    ...el.doc.data(),
                    id: el.doc.id
                }
            })
            return responseWithId;
        })
        .finally(() => {
            const obj = findObjwithNestedCollection(responseWithId, payload);
            deleteCollection(payload.db, `${payload.collectionPath}/${obj.id}/${payload.nestedCollectionPath}`, 500);
        })
}

function findObjwithNestedCollection(array, payload) {
    return array.find((item) => {
        return item[payload.targetObj.key] === payload.targetObj.value;
    });
}

//  __________________________Inserting Documents__________________________

function createCollection(payload) {
    payload.collection.forEach((obj, i) => {
        payload.db.collection(payload.collectionPath)
            .add(obj)
            .then((docRef) => {
                console.log("Document written with ID: ", docRef.id);

                if (payload.nestedCollectionPath) {
                    createNestedCollection(obj, docRef, i, payload);
                }

            }).catch((error) => {
                console.error("Error adding document: ", error);
            });
    });
}

function createNestedCollection(obj, docRef, i, payload) {
    obj.id = docRef.id;
    
    for (let j = 0; j < payload.nestedCollectionParentIndex.length; j++) {
        const { id } = payload.collection[payload.nestedCollectionParentIndex[j]];
        
        if (i === payload.nestedCollectionParentIndex[j]) {
            payload.nestedCollection[j].forEach((obj) => {
                payload.db.collection(`${payload.collectionPath}/${id}/${payload.nestedCollectionPath[j]}`)
                    .add(obj)
                    .then(() => {
                        console.log("sub collection written: ", obj);
                    })
                    .catch((error) => {
                        console.log('sub collection', error);
                    })
            })
    
        }
    }
}


function populateDB(payload) {
    const collectionRef = payload.db.collection(payload.collectionPath);

    collectionRef
        .get()
        .then((response) => {
            if (!response.empty) {

                if (payload.nestedCollectionPath) {
                    removeNestedCollection(payload);
                }

                deleteCollection(payload.db, payload.collectionPath, 500)
                    .then(() => {
                        createCollection(payload);
                    });

            } else {
                createCollection(payload);
            }
        })
}


module.exports = {
    populate: populateDB
}