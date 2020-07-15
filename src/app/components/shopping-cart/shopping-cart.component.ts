import * as fsBatchedWrites from '../batched-writes';
import * as utilities from '../utilities';
import { Component, OnInit, OnDestroy } from '@angular/core';
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
export class ShoppingCartComponent implements OnInit, OnDestroy {

    public pruductsInBucket: IProduct[];
    public isWhatWeDoInTheShadow: IProduct[] =[];
    public th: string[] = ['', 'Product', 'Quantity', 'Price'];

    public totalAmount: number;
    private uid: string = localStorage.getItem('uid');
    private destroyed$: Subject<boolean> = new Subject();

    constructor(
        private service: DataService,
        private router: Router,
        private db: AngularFirestore
    ) { }

    public getBucket(): void {
        this.service.getItem('userBucket', this.uid)
            .pipe(takeUntil(this.destroyed$))
            .subscribe((response: any) => {
                const { items } = response;
                this.isWhatWeDoInTheShadow = items;
                const data = utilities.default.groupBy(this.isWhatWeDoInTheShadow, 'title');

                this.isWhatWeDoInTheShadow.forEach((obj: IProduct) => {
                    obj.quantity = data[obj.title]?.length;
                });

                this.pruductsInBucket = utilities.default.removeDuplicates(this.isWhatWeDoInTheShadow, 'title');
                this.getTotalAmount(this.pruductsInBucket);
            });
    }

    public addItem(currentProduct: IProduct): void {
        currentProduct.id = Date.now().toString();
        this.isWhatWeDoInTheShadow.push(currentProduct);
        this.isWhatWeDoInTheShadow.forEach((obj, i) => obj.seqN = i + 1);
        fsBatchedWrites.default.update(this.db, 'userBucket', this.uid, { items: this.isWhatWeDoInTheShadow });
    }

    public removeItem(currentProduct: IProduct): void {
        if (currentProduct.quantity >= 1) {
            const indexInBucket: number = this.isWhatWeDoInTheShadow.indexOf(currentProduct);
            this.isWhatWeDoInTheShadow.splice(indexInBucket, 1);
            fsBatchedWrites.default.update(this.db, 'userBucket', this.uid, { items: this.isWhatWeDoInTheShadow });
        }
    }

    public getTotalAmount(data: IProduct[]): void {
        const total = data.map(obj => obj.price * obj.quantity);
        const reducer = (accumulator, currentValue) => accumulator + currentValue;
        this.totalAmount = total.reduce(reducer);
    }

    public emptyBucket(): void {
        fsBatchedWrites.default.update(this.db, 'userBucket', this.uid, { items: [] });
    }

    public handleClick(data: boolean): void {
        if (data) {
            this.router.navigate(['/products']);
        }
    }

    public navigateTo(): void {
        localStorage.setItem('pruductsInBucket', JSON.stringify(
            {
                totalAmount: this.totalAmount,
                pruductsInBucket: this.pruductsInBucket,
                numberOfItems: this.isWhatWeDoInTheShadow.length
            }
        ));
        this.router.navigate(['/check-out']);
    }

    public ngOnInit(): void {
        this.getBucket();
    }

    public ngOnDestroy(): void {
        this.destroyed$.next(true);
        this.destroyed$.complete();
    }
}