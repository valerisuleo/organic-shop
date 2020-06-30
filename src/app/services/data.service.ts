import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/firestore';
import { ID } from './interfaces';
import { map, first } from 'rxjs/operators';
import { snapsCoverter } from './db-utlities';
import { OrderByDirection } from '@firebase/firestore-types';

@Injectable()
export class DataService {

    constructor(private db: AngularFirestore) { }

    getAll(collectioName: string) {
        const response: AngularFirestoreCollection<ID> = this.db.collection(collectioName);

        return response.snapshotChanges()
            .pipe(
                map((actions) => {
                    return actions.map((rawData) => {
                        const obj = rawData.payload.doc.data();
                        obj.id = rawData.payload.doc.id;
                        return obj;
                    });
                }))
    }

    getCollectionPaginated(
        collectioName: string,
        key: string,
        sortOrder: OrderByDirection,
        pageNumber?: number,
        pageSize?: number
    ) {
        const response: AngularFirestoreCollection<ID> = this.db.collection(
            collectioName,
            ref => ref
                .orderBy(key, sortOrder)
                .limit(pageSize)
                .startAfter(pageNumber * pageSize)
        );

        return response.snapshotChanges()
            .pipe(
                map(snaps => snapsCoverter(snaps)),
                first()
            )
    }

    getCollectionOrderBy(
        collectioName: string,
        key: string,
        sortOrder: OrderByDirection,
      
    ) {
        const response: AngularFirestoreCollection<ID> = this.db.collection(
            collectioName,
            ref => ref
                .orderBy(key, sortOrder)
        );

        return response.snapshotChanges()
            .pipe(
                map(snaps => snapsCoverter(snaps)),
                first()
            )
    }

    getItem(collectioName: string, id: string) {
        return this.db.collection(collectioName).doc(id).valueChanges();
    }

    update(collectioName: string, id: string, resource) {
        return this.db.collection(collectioName).doc(id).set(resource);
    }


}
