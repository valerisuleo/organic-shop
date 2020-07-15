import * as utilities from '../../utilities';
import * as fsBatchedWrites from '../../batched-writes';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { DataService } from '../../../services/data.service';
import { IProduct, ICategory } from '../../products/interfaces';
import { BootstrapFormComponent } from '../../../reusable-components/bootstrap-form/bootstrap-form.component';
import formTemplate from './form-template';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { AngularFirestore } from '@angular/fire/firestore';
import { Router } from '@angular/router';
import { JsonPipe } from '@angular/common';

@Component({
    selector: 'admin-products-edit',
    templateUrl: './admin-products-edit.component.html',
    styleUrls: ['./admin-products-edit.component.scss']
})
export class AdminProductsEditComponent extends BootstrapFormComponent implements OnInit, OnDestroy {

    public categories: ICategory[] = [];
    public product: IProduct;
    private destroyed$: Subject<boolean> = new Subject();

    constructor(
        private service: DataService,
        private router: Router,
        private db: AngularFirestore) {
        super()
    }

    private getCategories(): void {
        this.service.getAll('categories')
            .pipe(takeUntil(this.destroyed$))
            .subscribe((res: any) => {
                this.categories = res.map((obj) => {
                    return {
                        name: obj.categoryName,
                        id: obj.id,
                    }
                });
                this.getProduct();
            });
    }

    private getProduct(): void {
        if (!localStorage.getItem('product')) {
            const { data } = history.state;
            this.product = data;
            localStorage.setItem('product', JSON.stringify(data));
        } else {
            this.product = JSON.parse(localStorage.getItem('product'));
        }
        this.setFormValue(this.product);
    }

    public setFormValue(product: IProduct): void {
        this.formGroup.setValue({
            title: product.title,
            imageUrl: product.imageUrl,
            price: product.price,
            categories: this.preSelectCategory()
        });
    }

    public preSelectCategory(): ICategory {
        const { category } = this.product;
        const current: string = category.toLowerCase();
        return this.categories.find(item => item.name.toLowerCase() === current);
    }

    public handleSubmit(isSubmitted: boolean): void {
        if (isSubmitted) {
            const clone = { ...this.product };
            const { value } = this.formGroup;
            const { id, name } = value.categories;
            const collectionPath = utilities.default.pathMaker(name, id);

            clone.imageUrl = value.imageUrl;
            clone.price = value.price;
            clone.title = value.title;

            if (clone.category === value.categories.name) {
                this.service.updateItem(collectionPath, `/${clone.id}`, clone);
                this.router.navigate(['/admin/products']);
            } else {
                clone.category = value.categories.name;

                this.service.getCollectionOrderBy(collectionPath, 'seqN', "desc")
                    .pipe(takeUntil(this.destroyed$))
                    .subscribe((response: any) => {

                        const seqNHighest = response[0].seqN;
                        clone.seqN = seqNHighest + 1;

                        const prevCategory: ICategory = this.categories.find((obj) => obj.name === this.product.category);
                        const originalPath: string = utilities.default.pathMaker(prevCategory.name, prevCategory.id)

                        fsBatchedWrites.default.remove(this.db, originalPath, clone.id);
                        fsBatchedWrites.default.create(this.db, collectionPath, clone.id, clone);
                        this.router.navigate(['/admin/products']);
                    });
            }
        }
    }

    public handleDelete(isClicked: boolean): void {
        if (isClicked) {
            const { id, category } = this.product;
            const categoryObj: ICategory = this.categories.find((obj) => obj.name === category);
            const collectionPath = utilities.default.pathMaker(category, categoryObj.id);

            this.service.delete(collectionPath, id)
                .then()
                .catch((err) => {
                    if (!err) {
                        console.log('no err');
                    }
                });

            fsBatchedWrites.default.resetSeqNum(this.db, collectionPath);
            setTimeout(() => {
                this.router.navigate(['/admin/products']);
            }, 1000);
        }
    }

    public ngOnInit(): void {
        this.formMaker(formTemplate);
        this.getCategories();
    }

    public ngOnDestroy(): void {
        this.destroyed$.next(true);
        this.destroyed$.complete();
        localStorage.removeItem('product');
    }
}
