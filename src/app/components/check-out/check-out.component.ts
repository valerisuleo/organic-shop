import * as fsBatchedWrites from '../batched-writes';
import { Component, OnInit } from '@angular/core';
import { IProduct } from '../products/interfaces';
import { BootstrapFormComponent } from '../../reusable-components/bootstrap-form/bootstrap-form.component';
import formTemplate from './form-template';
import { AuthService } from '../../services/auth.service';
import { AngularFirestore } from '@angular/fire/firestore';
import { DataService } from '../../services/data.service';
import { Router } from '@angular/router';


@Component({
    selector: 'check-out',
    templateUrl: './check-out.component.html',
    styleUrls: ['./check-out.component.scss']
})
export class CheckOutComponent extends BootstrapFormComponent implements OnInit {

    public totalAmount: number;
    public numberOfItems: number;
    public uid: string;
    public productsInBucket: IProduct[] = [];

    constructor(
        private authService: AuthService,
        private db: AngularFirestore,
        private router: Router,
        private service: DataService) {
        super()
    }

    private setSummary(): void {
        const data = JSON.parse(localStorage.getItem('pruductsInBucket'));
        this.productsInBucket = data.pruductsInBucket;
        this.totalAmount = data.totalAmount;
        this.numberOfItems = data.numberOfItems;
    }

    private placeOrder(value): void {
        const collectionName: string = 'ordersPlaced';
        const data = JSON.parse(localStorage.getItem('pruductsInBucket'));
        const newResource = { bucket: data, userInfo: value };
        const timeStamp: Date = new Date();
        
        newResource.userInfo.id = this.uid;
        newResource.userInfo.timeStamp = timeStamp;

        this.service
            .create(collectionName, newResource)
            .then((res) => {
                if (res.id) {
                    this.router.navigate(['/order-success']);
                }
            })
            .catch(error => console.log(error));
            
        fsBatchedWrites.default.update(this.db, 'userBucket', this.uid, { items: [] });
    }

    public handleSubmit(isSubmitted: boolean): void {
        if (isSubmitted) {
            const { value } = this.formGroup;
            this.placeOrder(value);
        }
        this.formGroup.reset();
    }

    public ngOnInit(): void {
        this.formMaker(formTemplate);
        this.setSummary();
        this.authService.getAuthState().subscribe((response: any) => this.uid = response.uid);
    }
}
