import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable()
export class ShoppingService {

    private subject = new Subject();
    public numbOfItemsInBucket: number;

    constructor() { }

    sendData() {
        this.subject.next(this.numbOfItemsInBucket);
    }

    get getData() {
        return this.subject.asObservable();
    }
}