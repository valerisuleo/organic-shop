import * as fsBatchedWrites from '../batched-writes';
import { Component, OnInit } from '@angular/core';
import { Subject } from 'rxjs';
import { DataService } from '../../services/data.service';
import { takeUntil } from 'rxjs/operators';
import { IProduct } from '../products/interfaces';
import { AngularFirestore } from '@angular/fire/firestore';
import { Router } from '@angular/router';

@Component({
    selector: 'shopping-cart',
    templateUrl: './shopping-cart.component.html',
    styleUrls: ['./shopping-cart.component.scss']
})
export class ShoppingCartComponent implements OnInit {

    public isWhatWeDoInTheShadow: IProduct[] = []
    public pruductsInBucket: IProduct[];
    public th: string[] = ['', 'Product', 'Quantity', 'Price'];

    private uniqueObject = {};
    public totalAmount: number;
    private uid: string = localStorage.getItem('uid');
    private destroyed$: Subject<boolean> = new Subject();

    constructor(
        private service: DataService, 
        private router: Router, 
        private db: AngularFirestore) { }

    public getBucket(): void {
        this.service.getItem('userBucket', this.uid)
            .pipe(takeUntil(this.destroyed$))
            .subscribe((response: any) => {
                if (response && response.items.length) {
                    const { items } = response;
                    this.isWhatWeDoInTheShadow = items;
                    this.pruductsInBucket = this.removeDuplicates(items);
                    this.getTotalAmount(this.pruductsInBucket);
                }
            });
    }
    
    private removeDuplicates(items): any[] {
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

    private objectToArray(obj): any[][] {
        return Object.keys(obj).map((key) => {
            return [key, obj[key]];
        });
    }

    public addItem(currentProduct: IProduct): void {
        const clone = { ...currentProduct };
        const index: number = this.pruductsInBucket.indexOf(currentProduct);

        clone.count = currentProduct.count + 1;
        clone.id = Date.now().toString();
        this.pruductsInBucket[index] = clone;

        this.isWhatWeDoInTheShadow.push(clone);
        this.isWhatWeDoInTheShadow.forEach((obj, i) => obj.seqN = i + 1);

        fsBatchedWrites.default.update(this.db, 'userBucket', this.uid, { items: this.isWhatWeDoInTheShadow });
    }

    public removeItem(currentProduct: IProduct): void {
        const index: number = this.pruductsInBucket.indexOf(currentProduct);

        if (currentProduct.count >= 1) {
            currentProduct.count = currentProduct.count - 1;
            this.pruductsInBucket[index] = currentProduct;

            const indexInBucket: number = this.isWhatWeDoInTheShadow.indexOf(currentProduct);
            this.isWhatWeDoInTheShadow.splice(indexInBucket, 1);

            fsBatchedWrites.default.update(this.db, 'userBucket', this.uid, { items: this.isWhatWeDoInTheShadow });
        }
    }

    public getTotalAmount(producsInBucket: IProduct[]): void {
        const total = producsInBucket.map(obj => obj.price * obj.count);
        const reducer = (accumulator, currentValue) => accumulator + currentValue;
        this.totalAmount = total.reduce(reducer);
    }

    public emptyBucket(): void {
        fsBatchedWrites.default.update(this.db, 'userBucket', this.uid, { items: [] });
        this.isWhatWeDoInTheShadow = [];
    }

    public handleClick(data: boolean): void {
        if (data) {
            this.router.navigate(['/products']);
        }
    }

    public ngOnInit(): void {
        this.getBucket();
    }

    public ngOnDestroy(): void {
        this.destroyed$.next(true);
        this.destroyed$.complete();
    }
}
