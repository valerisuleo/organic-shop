import { Component, OnInit } from '@angular/core';
import { IProduct } from '../products/interfaces';

@Component({
    selector: 'check-out',
    templateUrl: './check-out.component.html',
    styleUrls: ['./check-out.component.scss']
})
export class CheckOutComponent implements OnInit {

    public totalAmount: number;
    public productsInBucket: IProduct[] = [];
    
    constructor() { }

    public ngOnInit(): void {
       const data = JSON.parse(localStorage.getItem('pruductsInBucket'));
       this.productsInBucket = data.pruductsInBucket;
       this.totalAmount = data.totalAmount;       
    }

}
