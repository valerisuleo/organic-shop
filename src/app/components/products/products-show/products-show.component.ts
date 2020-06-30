import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subject } from 'rxjs';
import { BootstrapFormComponent } from '../../../reusable-components/bootstrap-form/bootstrap-form.component';
import { DataService } from '../../../services/data.service';
import { AngularFirestore } from '@angular/fire/firestore';
import { IProduct, ICategory } from '../interfaces';
import formTemplate from './form-template';
import * as fsBatchedWrites from '../../batched-writes';
import { takeUntil } from 'rxjs/operators';

@Component({
    selector: 'products-show',
    templateUrl: './products-show.component.html',
    styleUrls: ['./products-show.component.scss']
})
export class ProductsShowComponent extends BootstrapFormComponent implements OnInit, OnDestroy {

    constructor(private service: DataService, private db: AngularFirestore) {
        super()
    }

    public id: string;
    public apiEndPoint: string;
    public product: IProduct;
    private destroyed$: Subject<boolean> = new Subject();

    productDetail(): void {
        const { data } = history.state;
        if (data) {
            localStorage.setItem('product', JSON.stringify(data));
            this.product = data;
        } else {
            const fetchDataFromLocalStorage = JSON.parse(localStorage.getItem('product'));
            this.product = fetchDataFromLocalStorage;
        }
        this.setFormValue(this.product);
        this.apiEndPoint = this.product.category.toLowerCase();
        this.id = this.product.id;
    }

    setFormValue(product: IProduct): void {
        this.formGroup.setValue({
            title: product.title,
            imageUrl: product.imageUrl,
            price: product.price,
            categories: this.preSelectCategory()
        });
    }

    preSelectCategory(): ICategory {
        const { categories, category } = this.product;
        const current: string = category.toLowerCase();
        return categories.find(item => item.name.toLowerCase() === current);
    }

    productEdit(resource: IProduct): void {
        this.service.updateItem(this.apiEndPoint, this.id, resource);
    }

    handleSubmit(isSubmitted: boolean): void {

        if (isSubmitted) {
            const { value } = this.formGroup;
            const product = { ...this.product };

            product.imageUrl = value.imageUrl;
            product.price = value.price;
            product.title = value.title;

            if (product.category === value.categories.name) {
                this.productEdit(product);
                this.refreshStorage();

            } else {
                product.category = value.categories.name;

                let newApiEndPoint: string = value.categories.name;
                newApiEndPoint = newApiEndPoint.replace(/ /g, '').toLowerCase();

                this.service.getCollectionOrderBy(newApiEndPoint, 'seqN', "desc")
                    .pipe(takeUntil(this.destroyed$))
                    .subscribe((response: any) => {
                        const seqNHighest = response[0].seqN;
                        product.seqN = seqNHighest + 1;
                        fsBatchedWrites.default.remove(this.db, this.apiEndPoint, this.id);
                        fsBatchedWrites.default.create(this.db, newApiEndPoint, this.id, product);
                    });
            }
        }
        this.formGroup.reset();
    }

    refreshStorage(): void {
        this.service.getItem(this.apiEndPoint, this.id)
            .pipe(takeUntil(this.destroyed$))
            .subscribe((response: any) => {
                this.product = response;
                localStorage.setItem('product', JSON.stringify(this.product));
            });
    }

    ngOnInit(): void {
        this.formMaker(formTemplate);
        this.productDetail();
    }

    ngOnDestroy(): void {
        this.destroyed$.next(true);
        this.destroyed$.complete();
    }
}
