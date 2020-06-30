import { Component, OnInit, OnDestroy } from '@angular/core';
import * as fsBatchedWrites from '../../batched-writes';
import { DataService } from '../../../services/data.service';
import { IProduct, ICategoryMenu, IListGroup, ICategory, IBucketMap } from '../interfaces';
import { Subscription } from 'rxjs';
import { Router } from '@angular/router';
import { AngularFirestore } from '@angular/fire/firestore';
import { AuthService } from '../../../services/auth.service';

@Component({
    selector: 'products-index',
    templateUrl: './products-index.component.html',
    styleUrls: ['./products-index.component.scss']
})
export class ProductsIndexComponent implements OnInit, OnDestroy {

    public listGroup: IListGroup;
    public products: IProduct[] = [];
    public bucket: IProduct[] = [];
    public categories: ICategoryMenu[] = [];
    public bucketMap: IBucketMap[] = [];

    public lastPageloaded: number = 0;
    public collectionSize: number = 6;
    public page: number = 1;
    public pageSize: number = 4;
    // default apiCalled onload
    public apiEndpoint: string;

    constructor(
        private service: DataService,
        private authService: AuthService,
        private db: AngularFirestore,
        private router: Router
    ) { }

    getCategoriesMenu(): void {
        this.service.getAll('categories')
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

    getDefaultCollection(array: ICategoryMenu[], key: string, string): ICategoryMenu {
        return array.find((obj) => {
            return obj[key] === string;
        });
    }

    pathMaker(string, id: string): string {
        const subPath: string = string.replace(/ /g, '').toLowerCase();
        return `categories/${id}/${subPath}`;
    }

    handleSelectedLi(obj: ICategoryMenu): void {
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

    // _________________________HANDLE PAGINATION_________________________

    getCollection(): void {
        this.service
            .getCollectionPaginated(this.apiEndpoint, 'seqN', "asc", this.lastPageloaded, 4)
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
                        element.isOpen = true;
                    }
                    this.products = response;
                });
            });
    }

    handlePageChange(currentPage): void {
        this.lastPageloaded = currentPage - 1;
        this.getCollection();
    }

    handlePagination(e): void {
        const next: string = 'Next';
        const previous: string = 'Previous';
        const current: HTMLElement = e.target;

        if (current.getAttribute("aria-label") === next ||
            current.parentElement.getAttribute("aria-label") === next) {
            this.getNextSetOfItems();
        }

        if (current.getAttribute("aria-label") === previous ||
            current.parentElement.getAttribute("aria-label") === previous) {
            this.getPreviousSetOfItems();
        }
    }

    getNextSetOfItems(): void {
        this.lastPageloaded = this.lastPageloaded + 1;
        this.getCollection();
    }

    getPreviousSetOfItems(): void {
        this.lastPageloaded = this.lastPageloaded - 1;
        this.getCollection();
    }

    // _________________________HANDLE COUNTERS_________________________
    counterShow(current: IProduct) {
        current.isOpen = true;
    }

    // populate counters if data on db.
    getBucket(): void {
        const uid = localStorage.getItem('uid');
        this.service.getItem('userBucket', uid)
            .subscribe((response: any) => {
                const { items } = response;
                if (items.length) {
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

    objectToArray(obj): any[][] {
        return Object.keys(obj).map((key) => {
            return [key, obj[key]];
        });
    }

    filterAndCount(acc, current, array): any {
        const title = current.title;
        if (!acc[title]) {
            acc[title] = array.filter(item => item.title === current.title).length;
        }
        return acc;
    }

    addItem(current: IProduct) {
        const uid = localStorage.getItem('uid');
        const index = this.products.indexOf(current);
        // updating view
        current.count = current.count + 1;
        this.products[index] = current;
        // updating db
        this.bucket.push(current);
        this.bucket.forEach((obj, i) => obj.seqN = i + 1);
        fsBatchedWrites.default.update(this.db, 'userBucket', uid, { items: this.bucket });
    }

    removeItem(current: IProduct) {
        const uid = localStorage.getItem('uid');

        if (current.count >= 1) {
            const index = this.products.indexOf(current);
            current.count = current.count - 1;
            this.products[index] = current;
            // remove item from bucket on db
            const indexInBucket = this.bucket.indexOf(current);
            this.bucket.splice(indexInBucket, 1);
            fsBatchedWrites.default.update(this.db, 'userBucket', uid, { items: this.bucket })
        }
        if (current.count === 0) {
            current.isOpen = false;
        }
    }

    ngOnInit(): void {
        this.getBucket();
        this.getCategoriesMenu();
    }

    ngOnDestroy(): void {
    }
}
