import { Component, OnInit, OnDestroy } from '@angular/core';
import { DataService } from '../../../services/data.service';
import { IProduct } from '../../products/interfaces';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
    selector: 'admin-products',
    templateUrl: './admin-products.component.html',
    styleUrls: ['./admin-products.component.scss']
})
export class AdminProductsComponent implements OnInit, OnDestroy {

    public allProducts: IProduct[] = [];
    private destroyed$: Subject<boolean> = new Subject();
    public lastPageloaded: number = 0;


    constructor(private service: DataService) { }

    public pathMaker(string, id: string): string {
        const subPath: string = string.replace(/ /g, '').toLowerCase();
        return `categories/${id}/${subPath}`;
    }

    getEndpoints() {
        this.service.getAll('categories')
        .pipe(takeUntil(this.destroyed$))
            .subscribe((data: any) => {
                const apiEndPoints = data.map((obj) => {
                    return this.pathMaker(obj.categoryName, obj.id);
                });
                this.getCollections(apiEndPoints);
            });
    }

    private getCollections(apiEndPoints: string[]): void {
        apiEndPoints.forEach((apiEndPoint: string) => {
            this.service.getCollectionPaginated(apiEndPoint, 'seqN', "asc", this.lastPageloaded, 4)
                .subscribe((response: any) => {
                    response.forEach((item: IProduct) => {
                        this.allProducts.push(item);
                    });
                    console.log(this.allProducts);
                });
        });
    }

    public ngOnInit(): void {
        this.getEndpoints();
    }

    public ngOnDestroy(): void {
        this.destroyed$.next(true);
        this.destroyed$.complete();
    }
    

}
