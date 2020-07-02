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
    
    public bucket: IProduct[];
    public th: string[] = ['', 'Product', 'Quantity', 'Price'];
    private isWhatWeDoInTheShadow: IProduct[] =[]
    private uid: string = localStorage.getItem('uid');

    private uniqueObject = {};
    private destroyed$: Subject<boolean> = new Subject();

    constructor(private service: DataService, private db: AngularFirestore) { }

    public getBucket(): void {
        this.service.getItem('userBucket', this.uid)
            .pipe(takeUntil(this.destroyed$))
            .subscribe((response: any) => {                
                this.isWhatWeDoInTheShadow = response.items;
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
        const clone = { ...currentProduct };        
        const index = this.bucket.indexOf(currentProduct);
        
        clone.count = currentProduct.count + 1;
        clone.id = Date.now().toString();
        this.bucket[index] = clone;

        this.isWhatWeDoInTheShadow.push(clone);
        this.isWhatWeDoInTheShadow.forEach((obj, i) => obj.seqN = i + 1);

        fsBatchedWrites.default.update(this.db, 'userBucket', this.uid, { items: this.isWhatWeDoInTheShadow });
    }

    public removeItem(currentProduct: IProduct) {
        const index = this.bucket.indexOf(currentProduct);
        
        currentProduct.count = currentProduct.count -1;
        this.bucket[index] = currentProduct;

        const indexInBucket = this.isWhatWeDoInTheShadow.indexOf(currentProduct);
        this.isWhatWeDoInTheShadow.splice(indexInBucket, 1);
        
        fsBatchedWrites.default.update(this.db, 'userBucket', this.uid, { items: this.isWhatWeDoInTheShadow });
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
