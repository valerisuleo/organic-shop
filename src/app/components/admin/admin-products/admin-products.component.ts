import * as _ from 'lodash';
import * as utilities from '../../utilities';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { DataService } from '../../../services/data.service';
import { IProduct, IPagination } from '../../products/interfaces';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { IThLabel } from '../interfaces';
import { faArrowUp, faArrowDown, IconDefinition } from '@fortawesome/free-solid-svg-icons';
import { OrderByDirection } from '@firebase/firestore-types';
import { Router } from '@angular/router';

@Component({
    selector: 'admin-products',
    templateUrl: './admin-products.component.html',
    styleUrls: ['./admin-products.component.scss']
})
export class AdminProductsComponent implements OnInit, OnDestroy {

    public lastPageloaded: number = 0;
    public collectionSize: number;
    public page: number = 1;
    public pageSize: number = 4;
    public currentLi: HTMLElement;

    public faArrow: IconDefinition = faArrowUp;
    public stock: IProduct[] = [];
    public th: IThLabel[] = [];
    public apiEndPoints: string[] = [];
    public query: string;
    private isArrowUp: boolean = true;
    private destroyed$: Subject<boolean> = new Subject();

    constructor(private service: DataService, private router: Router) { }

    private getEndpoints(): void {
        this.service
            .getAll('categories')
            .pipe(takeUntil(this.destroyed$))
            .subscribe((response: any) => {
                this.sumValuesObjArray(response);

                response.forEach((obj) => {
                    if (obj.collectionSize > 0) {
                        const path = utilities.default.pathMaker(obj.categoryName, obj.id);
                        this.apiEndPoints.push(path);
                    }
                });
                this.getCollections();
            });
    }

    private getCollections(): void {
        const all: IProduct[] = [];

        this.apiEndPoints.forEach((apiEndPoint: string) => {
            this.service
                .getCollectionPaginated(apiEndPoint, 'seqN', "asc", this.lastPageloaded, 4)
                .subscribe((response: any) => {
                    response.forEach((item: IProduct) => all.push(item));
                    this.stock = all;
                    this.stock = this.stock.slice((this.page - 1) * this.pageSize, (this.page - 1) * this.pageSize + this.pageSize);
                });
        });
    }

    public sumValuesObjArray(arr) {
        let initialValue = 0;
        let sum: number = arr.reduce(function (accumulator, currentValue) {
            return accumulator + currentValue.collectionSize
        }, initialValue);
        this.collectionSize = sum;
    }

    public thMaker(): void {
        const labels = ['Title', 'Price', ''];
        const sortColPath = ['title', 'price', ''];

        this.th = labels.map((item, i) => {
            return {
                label: item,
                sortPath: sortColPath[i],
                isVisible: i === 0 ? true : false
            }
        });
    }

    public onSort(currentCol?: IThLabel): void {
        if (currentCol) {
            this.th.forEach(element => element.isVisible = false);
            currentCol.isVisible = true;
        };

        this.isArrowUp = !this.isArrowUp;

        const sortColPath = currentCol ? currentCol.sortPath : 'title';
        const sortColOrder: OrderByDirection = this.isArrowUp ? "desc" : "asc";
        this.faArrow = this.isArrowUp ? faArrowDown : faArrowUp;

        const sorted: IProduct[] = _.orderBy(this.stock, sortColPath, sortColOrder);
        this.stock = sorted;
    }

    navigateTo(item) {
        this.router.navigate([`/admin/products/edit/${item.id}`], { state: { data: item } });
    }

    // _________________________HANDLE PAGINATION_________________________
    public getCurrent(e): void {
        this.currentLi = e.target;
    }

    public handlePagination(data: IPagination): void {
        const { name, lastPageloaded } = data;
        setTimeout(() => {
            this.lastPageloaded = lastPageloaded;
            this.getCollections();
        }, 500);
    }

    public ngOnInit(): void {
        this.getEndpoints();
        this.thMaker();
    }

    public ngOnDestroy(): void {
        this.destroyed$.next(true);
        this.destroyed$.complete();
    }
}
