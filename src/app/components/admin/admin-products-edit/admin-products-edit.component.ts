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

    public pathMaker(string, id: string): string {
        const subPath: string = string.replace(/ /g, '').toLowerCase();
        return `categories/${id}/${subPath}`;
    }

    public handleSubmit(isSubmitted: boolean): void {
        if (isSubmitted) {
            const clone = { ...this.product };
            const { value } = this.formGroup;
            const { id, name } = value.categories;
            const collectionPath = this.pathMaker(name, id);

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
                    const originalPath: string = this.pathMaker(prevCategory.name, prevCategory.id);
                    
                    fsBatchedWrites.default.remove(this.db, originalPath, clone.id);
                    fsBatchedWrites.default.create(this.db, collectionPath, clone.id, clone);
                    this.router.navigate(['/admin/products']);
                });
            }
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
