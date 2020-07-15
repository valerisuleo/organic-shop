function create(db, path, id, obj) {
    const batch = db.firestore.batch();
    const ref = db.doc(`/${path}/${id}`).ref;

    batch.set(ref, obj);
    batch.commit();
}

function remove(db, path, id) {
    const batch = db.firestore.batch();
    const ref = db.doc(`/${path}/${id}`).ref;

    batch.delete(ref);
    batch.commit();
}

function update(db, path, id, obj) {
    const batch = db.firestore.batch();
    const ref = db.doc(`/${path}/${id}`).ref;

    batch.update(ref, obj);
    batch.commit();
}

async function resetSeqNum(db, path) {
    const batch = db.firestore.batch();
    const collection = await db.collection(path).get();

    collection.forEach((doc) => {
        const responseWithId = doc.docChanges().map((el) => {
            return {
                ...el.doc.data(),
                id: el.doc.id
            }
        });

        responseWithId.forEach((el, index) => {
            const ref = db.doc(`/${path}/${el.id}`).ref;
            const obj = { seqN: index };
            batch.update(ref, obj);
        });
        batch.commit();
    });
}

export default {
    create,
    remove,
    update,
    resetSeqNum
}