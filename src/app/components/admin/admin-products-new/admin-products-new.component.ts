import * as utilities from '../../utilities';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { BootstrapFormComponent } from '../../../reusable-components/bootstrap-form/bootstrap-form.component';
import formTemplate from '../admin-products-edit/form-template';
import { ICategory, IProduct } from '../../interfaces';
import { Subject } from 'rxjs';
import { DataService } from '../../../services/data.service';
import { takeUntil } from 'rxjs/operators';
import { Router } from '@angular/router';

@Component({
    selector: 'admin-products-new',
    templateUrl: './admin-products-new.component.html',
    styleUrls: ['./admin-products-new.component.scss']
})
export class AdminProductsNewComponent extends BootstrapFormComponent implements OnInit, OnDestroy {

    public categories: ICategory[] = [];
    private destroyed$: Subject<boolean> = new Subject();

    constructor(private service: DataService, private router: Router) {
        super()
    }

    private getCategories(): void {
        this.service
            .getAll('categories')
            .pipe(takeUntil(this.destroyed$))
            .subscribe((res: any) => {
                this.categories = res.map((obj) => {
                    return {
                        name: obj.categoryName,
                        id: obj.id,
                    }
                });
            });
    }

    public handleSubmit(isSubmitted: boolean): void {
        if (isSubmitted) {
            const clone = { ...this.formGroup.value };
            const collectionPath: string = utilities.default.pathMaker(clone.categories.name, clone.categories.id);

            this.service
                .getCollectionOrderBy(collectionPath, 'seqN', "desc")
                .pipe(takeUntil(this.destroyed$))
                .subscribe((response: any) => {

                    const seqNHighest: number = response[0].seqN;
                    clone.seqN = seqNHighest + 1;

                    const newResource: IProduct = {
                        category: clone.categories.name,
                        imageUrl: clone.imageUrl,
                        price: clone.price,
                        seqN: clone.seqN,
                        title: clone.title
                    };
                    this.service.create(collectionPath, newResource);
                    this.formGroup.reset();
                });
        }
    }

    public ngOnInit(): void {
        this.formMaker(formTemplate);
        this.getCategories();
    }

    public ngOnDestroy(): void {
        this.destroyed$.next(true);
        this.destroyed$.complete();
    }

}
