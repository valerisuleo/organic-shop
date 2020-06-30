import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';
import { Observable, Subject } from 'rxjs';

@Injectable()
export class ShoppingService {

    constructor() { }

    private subject = new Subject();
    allTodos: number;

    sendData() {
        this.subject.next(this.allTodos);
    }

    get getData() {
        return this.subject.asObservable();
    }


}