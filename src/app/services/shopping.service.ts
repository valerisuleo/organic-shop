import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';
import { Observable, Subject } from 'rxjs';

@Injectable()
export class ShoppingService {

    constructor() { }

    private subject = new Subject();
    numbOfItemsInBucket: number;

    sendData() {
        this.subject.next(this.numbOfItemsInBucket);
    }

    get getData() {
        return this.subject.asObservable();
    }


}