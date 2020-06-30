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

export default {
    create,
    remove,
    update
}