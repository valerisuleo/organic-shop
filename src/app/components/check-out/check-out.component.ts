import { Component, OnInit } from '@angular/core';
import { IProduct } from '../products/interfaces';
import { BootstrapFormComponent } from '../../reusable-components/bootstrap-form/bootstrap-form.component';
import formTemplate from './form-template';

@Component({
    selector: 'check-out',
    templateUrl: './check-out.component.html',
    styleUrls: ['./check-out.component.scss']
})
export class CheckOutComponent extends BootstrapFormComponent implements OnInit {

    public totalAmount: number;
    public itemsInBucket: number;
    public productsInBucket: IProduct[] = [];
    
    constructor() { 
        super()
    }

    handleSubmit(isSubmitted: boolean): void {

        if (isSubmitted) {
            const { value } = this.formGroup;

            console.log(value);
            

        }
        // this.formGroup.reset();
    }

    public ngOnInit(): void {
       const data = JSON.parse(localStorage.getItem('pruductsInBucket'));
       this.productsInBucket = data.pruductsInBucket;
       this.totalAmount = data.totalAmount;
       this.itemsInBucket = data.itemsInBucket;
       this.formMaker(formTemplate);
    }

}
