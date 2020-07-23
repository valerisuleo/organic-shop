import * as fsBatchedWrites from '../../batched-writes';
import * as utilities from '../utilities';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { DataService } from '../../services/data.service';
import { IProduct, ICategoryMenu, IListGroup, IPagination } from '../interfaces';
import { AngularFirestore } from '@angular/fire/firestore';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { AuthService } from '../../services/auth.service';

@Component({
    selector: 'products-list',
    templateUrl: './products-list.component.html',
    styleUrls: ['./products-list.component.scss']
})
export class ProductsIndexComponent implements OnInit, OnDestroy {

    private isWhatWeDoInTheShadow: IProduct[] = [];
    public listGroup: IListGroup;
    public categories: ICategoryMenu[] = [];
    public products: IProduct[] = [];

    public lastPageloaded: number = 0;
    public collectionSize: number = 6;
    public page: number = 1;
    public pageSize: number = 4;
    public currentLi: HTMLElement;

    public apiEndpoint: string;
    public uid: string;
    public animated: boolean = false;

    private destroyed$: Subject<boolean> = new Subject();

    constructor(
        private service: DataService,
        private authService: AuthService,
        private db: AngularFirestore,
    ) { }

    public getCategoriesMenu(): void {
        this.service.getAll('categories')
            .pipe(takeUntil(this.destroyed$))
            .subscribe((response: ICategoryMenu[]) => {
                const defaultCategory: ICategoryMenu = this.getDefaultCollection(response, 'categoryName', 'Vegetables');
                const { id, categoryName } = defaultCategory;

                this.apiEndpoint = utilities.default.pathMaker(categoryName, id);
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

    public handleSelectedLi(obj: ICategoryMenu): void {
        const { id, categoryName, collectionSize } = obj;
        // reset
        this.products = [];
        this.lastPageloaded = 0;
        this.apiEndpoint = utilities.default.pathMaker(categoryName, id);
        this.animated = true;
        setTimeout(() => {
            this.animated = false;
        }, 500);
        //
        this.collectionSize = collectionSize;
        this.getCollection();
    }

    public getCollection(): void {
        this.service.getCollectionPaginated(this.apiEndpoint, 'seqN', "asc", this.lastPageloaded, 4)
            .pipe(takeUntil(this.destroyed$))
            .subscribe((response: any) => {

                response.forEach((element: IProduct) => {

                    if (this.isWhatWeDoInTheShadow.length) {
                        const result = this.isWhatWeDoInTheShadow.find((obj) => {
                            return obj.title === element.title;
                        });
                        element.quantity = result?.quantity ? result?.quantity : 0;
                        element.isOpen = result?.quantity ? true : false;

                    } else {
                        element.quantity = 0;
                        element.isOpen = false;
                    }
                });
                this.products = response;
            });
    }

    // we prevent angular form rebuilding the whole DOM.
    public trackProduct(index, product): any {
        return product ? product.id : undefined;
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

    public getUserBucket(uid): void {
        this.service.getItem('userBucket', uid)
            .pipe(takeUntil(this.destroyed$))
            .subscribe((response: any) => {
                if (response && response.items) {
                    this.isWhatWeDoInTheShadow = response.items;
                }
                const data = utilities.default.groupBy(this.isWhatWeDoInTheShadow, 'title');
                this.isWhatWeDoInTheShadow.forEach((obj: IProduct) => {
                    obj.quantity = data[obj.title]?.length;
                });
            });
    }

    public addItem(current: IProduct): void {
        const clone = { ...current };
        clone.id = Date.now().toString();
        this.isWhatWeDoInTheShadow.push(clone);
        this.isWhatWeDoInTheShadow.forEach((obj, i) => obj.seqN = i + 1);
        fsBatchedWrites.default.update(this.db, 'userBucket', this.uid, { items: this.isWhatWeDoInTheShadow });
        this.getCollection();
    }

    public removeItem(current: IProduct) {
        if (current.quantity >= 1) {
            const result = this.isWhatWeDoInTheShadow.find(obj => obj.title === current.title);
            const index = this.isWhatWeDoInTheShadow.indexOf(result);
            this.isWhatWeDoInTheShadow.splice(index, 1);
            fsBatchedWrites.default.update(this.db, 'userBucket', this.uid, { items: this.isWhatWeDoInTheShadow });
            this.getCollection();
        }
    }

    public ngOnInit(): void {
        this.authService.getAuthState()
            .subscribe((data: any) => {
                if (data) {
                    const { uid } = data;
                    this.uid = uid;
                    this.getUserBucket(uid);
                    this.getCategoriesMenu();
                } else {
                    this.getCategoriesMenu();
                }
            });
    }

    public ngOnDestroy(): void {
        this.destroyed$.next(true);
        this.destroyed$.complete();
    }
}