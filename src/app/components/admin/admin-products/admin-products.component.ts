import * as _ from 'lodash';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { DataService } from '../../../services/data.service';
import { IProduct, IPagination } from '../../products/interfaces';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { IThLabel } from '../interfaces';
import { faArrowUp, faArrowDown, IconDefinition } from '@fortawesome/free-solid-svg-icons';
import { OrderByDirection } from '@firebase/firestore-types';

@Component({
    selector: 'admin-products',
    templateUrl: './admin-products.component.html',
    styleUrls: ['./admin-products.component.scss']
})
export class AdminProductsComponent implements OnInit, OnDestroy {

    public lastPageloaded: number = 0;
    public collectionSize: number;
    public page: number = 1;
    public pageSize: number = 6;
    public currentLi: HTMLElement;

    public faArrow: IconDefinition = faArrowUp;
    public stock: IProduct[] = [];
    public th: IThLabel[] = [];
    public apiEndPoints: string[] = [];
    private isArrowUp: boolean = true;
    private destroyed$: Subject<boolean> = new Subject();

    constructor(private service: DataService) { }

    private pathMaker(string, id: string): string {
        const subPath: string = string.replace(/ /g, '').toLowerCase();
        return `categories/${id}/${subPath}`;
    }

    private getEndpoints(): void {
        this.service.getAll('categories')
            .pipe(takeUntil(this.destroyed$))
            .subscribe((response: any) => {
                this.sumValuesObjArray(response);
                this.apiEndPoints = response.map((obj) => {
                    return this.pathMaker(obj.categoryName, obj.id);
                });
                this.getCollections();
            });
    }

    private getCollections(): void {
        const all: IProduct[] = [];
        this.apiEndPoints.forEach((apiEndPoint: string) => {
            this.service
                .getCollectionPaginated(apiEndPoint, 'seqN', "asc", this.lastPageloaded, 3)
                .subscribe((response: any) => {
                    response.forEach((item: IProduct) => {
                        all.push(item);
                    });
                    this.stock = all;
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

    // _________________________HANDLE PAGINATION_________________________
    public getCurrent(e): void {
        this.currentLi = e.target;
    }

    public handlePagination(data: IPagination): void {
        const { name, lastPageloaded } = data;
        this.lastPageloaded = lastPageloaded;
        this.getCollections();
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
