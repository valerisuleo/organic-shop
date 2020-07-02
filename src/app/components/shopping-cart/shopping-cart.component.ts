import * as fsBatchedWrites from '../batched-writes';
import { Component, OnInit } from '@angular/core';
import { Subject } from 'rxjs';
import { DataService } from '../../services/data.service';
import { takeUntil } from 'rxjs/operators';
import { IProduct } from '../products/interfaces';
import { AngularFirestore } from '@angular/fire/firestore';

@Component({
    selector: 'shopping-cart',
    templateUrl: './shopping-cart.component.html',
    styleUrls: ['./shopping-cart.component.scss']
})
export class ShoppingCartComponent implements OnInit {

    public th: string[] = ['', 'Product', 'Quantity', 'Price'];
    public bucket: IProduct[];

    private uniqueObject = {};
    private destroyed$: Subject<boolean> = new Subject();
    private whatWeDoInTheShadow: IProduct[] =[]

    constructor(private service: DataService, private db: AngularFirestore) { }

    public getBucket(): void {
        const uid = localStorage.getItem('uid');

        this.service.getItem('userBucket', uid)
            .pipe(takeUntil(this.destroyed$))
            .subscribe((response: any) => {                
                this.whatWeDoInTheShadow = response.items;
                this.bucket = this.removeDuplicates(response.items);
            });
    }

 
    private removeDuplicates(items) {
        for (let i = 0; i < items.length; i++) {
            // Extract the title 
            const objTitle = items[i].title;
            // Use the title as the index 
            this.uniqueObject[objTitle] = items[i];
        };
        return this.objectToArray(this.uniqueObject).map((objProperty) => {
            return objProperty[1];
        });
    }

    public addItem(currentProduct: IProduct) {
        const uid = localStorage.getItem('uid');
        const clone = { ...currentProduct };        
        const index = this.bucket.indexOf(currentProduct);
        
        clone.count = currentProduct.count + 1;
        clone.id = Date.now().toString();
        this.bucket[index] = clone;

        this.whatWeDoInTheShadow.push(clone);
        this.whatWeDoInTheShadow.forEach((obj, i) => obj.seqN = i + 1);

        fsBatchedWrites.default.update(this.db, 'userBucket', uid, { items: this.whatWeDoInTheShadow });
    }

    private objectToArray(obj): any[][] {
        return Object.keys(obj).map((key) => {
            return [key, obj[key]];
        });
    }

    public ngOnInit(): void {
        this.getBucket();
    }

    public ngOnDestroy(): void {
        this.destroyed$.next(true);
        this.destroyed$.complete();
    }
}
