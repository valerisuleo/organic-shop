import { Component, OnInit, OnDestroy } from '@angular/core';
import { BootstrapFormComponent } from '../../../reusable-components/bootstrap-form/bootstrap-form.component';
import formTemplate from '../admin-products-edit/form-template';
import { ICategory } from '../../products/interfaces';
import { Subject } from 'rxjs';
import { DataService } from '../../../services/data.service';
import { takeUntil } from 'rxjs/operators';

@Component({
    selector: 'admin-products-new',
    templateUrl: './admin-products-new.component.html',
    styleUrls: ['./admin-products-new.component.scss']
})
export class AdminProductsNewComponent extends BootstrapFormComponent implements OnInit, OnDestroy {

    public categories: ICategory[] = [];
    private destroyed$: Subject<boolean> = new Subject();



    constructor(private service: DataService,) {
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
                console.log(this.categories);

            });
    }

    public handleSubmit(isSubmitted: boolean) {
        if (isSubmitted) {
            const { value } = this.formGroup;
            console.log(value);
            

        }
    }

    ngOnInit(): void {
        this.formMaker(formTemplate);
        this.getCategories();

    }

    public ngOnDestroy(): void {
        this.destroyed$.next(true);
        this.destroyed$.complete();
    }

}
