import { Component, OnInit, OnDestroy } from '@angular/core';
import * as fsBatchedWrites from '../../batched-writes';
import { DataService } from '../../../services/data.service';
import { IProduct, ICategoryMenu, IListGroup, ICategory, IBucketMap, IPagination } from '../interfaces';
import { AngularFirestore } from '@angular/fire/firestore';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { ShoppingService } from '../../../services/shopping.service';

@Component({
    selector: 'products-index',
    templateUrl: './products-index.component.html',
    styleUrls: ['./products-index.component.scss']
})
export class ProductsIndexComponent implements OnInit, OnDestroy {
    
    public listGroup: IListGroup;
    public categories: ICategoryMenu[] = [];
    public products: IProduct[] = [];
    public bucket: IProduct[] = [];
    public prexistingBucket: IProduct[] = [];
    public bucketMap: IBucketMap[] = [];

    public lastPageloaded: number = 0;
    public collectionSize: number = 6;
    public page: number = 1;
    public pageSize: number = 4;
    public apiEndpoint: string;

    public currentLi: HTMLElement;
    private destroyed$: Subject<boolean> = new Subject();

    constructor(
        private service: DataService,
        private shoppingService: ShoppingService,
        private db: AngularFirestore,
    ) { }

    public getCategoriesMenu(): void {
        this.service.getAll('categories')
            .pipe(takeUntil(this.destroyed$))
            .subscribe((response: ICategoryMenu[]) => {
                const defaultCategory: ICategoryMenu = this.getDefaultCollection(response, 'categoryName', 'Bread');
                const { id, categoryName } = defaultCategory;

                this.apiEndpoint = this.pathMaker(categoryName, id);
                this.getCollection();

                const addCssClass = response.map((item: any) => {
                    return {
                        ...item,
                        cssClass: 'organic'
                    }
                });
                this.listGroup = { list: addCssClass, key: 'categoryName' };
            });
    }

    public getDefaultCollection(array: ICategoryMenu[], key: string, string): ICategoryMenu {
        return array.find((obj) => {
            return obj[key] === string;
        });
    }

    public pathMaker(string, id: string): string {
        const subPath: string = string.replace(/ /g, '').toLowerCase();
        return `categories/${id}/${subPath}`;
    }

    public handleSelectedLi(obj: ICategoryMenu): void {
        const { id, categoryName, collectionSize } = obj;
        // reset
        this.products = [];
        this.lastPageloaded = 0;
        //
        this.apiEndpoint = this.pathMaker(categoryName, id)
        this.collectionSize = collectionSize;
        this.getCollection();
    }

    // TO USE FOR ADMIN PROFILE
    // navigateTo(currentProduct: IProduct) {
    //     this.router.navigate([`/products/${currentProduct.id}`], { state: { data: currentProduct } });
    // }


    public getCollection(): void {
        this.service.getCollectionPaginated(this.apiEndpoint, 'seqN', "asc", this.lastPageloaded, 4)
            .pipe(takeUntil(this.destroyed$))
            .subscribe((response: any) => {
                response.forEach((element: IProduct, i) => {
                    if (this.bucketMap.length === 0) {
                        element.count = 0;
                        element.isOpen = false;
                    } else {
                        const objInBucket = this.bucketMap.find((item) => {
                            return item.name === element.title;
                        });
                        element.count = objInBucket?.quantity ? objInBucket?.quantity : 0;
                        element.isOpen = element.count ? true : false;
                    }
                    this.products = response;
                });
            });
    }

    // _________________________HANDLE PAGINATION_________________________
    public getCurrent(e): void {
        this.currentLi = e.target;
    }

    public handlePagination(data: IPagination): void {
        const { name, lastPageloaded } = data;
        this.lastPageloaded = lastPageloaded;
        this.getCollection();
    }

    // _________________________HANDLE COUNTERS_________________________
    public counterShow(current: IProduct) {
        current.isOpen = true;
    }

    // populate counters if data on db.
    public getBucket(): void {
        const uid = localStorage.getItem('uid');
        this.service.getItem('userBucket', uid)
            .pipe(takeUntil(this.destroyed$))
            .subscribe((response: any) => {
                const { items } = response;
                if (items.length) {

                    this.prexistingBucket = items;
                    this.shoppingService.allTodos = items.length;
                    this.shoppingService.sendData();

                    const result = items.reduce((acc, current) => this.filterAndCount(acc, current, items), {});
                    const bucketMap = this.objectToArray(result).map((item) => {
                        return {
                            name: item[0],
                            quantity: item[1]
                        }
                    });
                    this.bucketMap = bucketMap;
                }
            });
    }

    public objectToArray(obj): any[][] {
        return Object.keys(obj).map((key) => {
            return [key, obj[key]];
        });
    }

    public filterAndCount(acc, current, array): any {
        const title = current.title;
        if (!acc[title]) {
            acc[title] = array.filter(item => item.title === current.title).length;
        }
        return acc;
    }

    public addItem(current: IProduct) {
        const uid = localStorage.getItem('uid');
        const index = this.products.indexOf(current);
        // updating view
        const clone = { ...current };
        clone.id = Date.now().toString();
        clone.count = current.count + 1;
        this.products[index] = clone;
        // updating db
        if (this.prexistingBucket.length && !this.bucket.length) {
            this.bucket = this.prexistingBucket;
        }
        this.bucket.push(clone);
        this.bucket.forEach((obj, i) => obj.seqN = i + 1);
        fsBatchedWrites.default.update(this.db, 'userBucket', uid, { items: this.bucket });
    }

    public removeItem(current: IProduct) {
        const uid = localStorage.getItem('uid');

        if (current.count >= 1) {
            const index = this.products.indexOf(current);
            current.count = current.count - 1;
            this.products[index] = current;
            // remove item from bucket on db
            if (this.prexistingBucket.length && !this.bucket.length) {
                this.bucket = this.prexistingBucket;
            }
            const indexInBucket = this.bucket.indexOf(current);
            this.bucket.splice(indexInBucket, 1);
            fsBatchedWrites.default.update(this.db, 'userBucket', uid, { items: this.bucket })
        }
        if (current.count === 0) {
            current.isOpen = false;
        }
    }

    public ngOnInit(): void {
        this.getBucket();
        this.getCategoriesMenu();
    }

    public ngOnDestroy(): void {
        this.destroyed$.next(true);
        this.destroyed$.complete();
    }
}
