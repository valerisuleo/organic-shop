import * as _ from 'lodash';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { DataService } from '../../../services/data.service';
import { IOrder, IThLabel } from '../interfaces';
import { OrderByDirection } from '@firebase/firestore-types';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { faArrowUp, faArrowDown, IconDefinition } from '@fortawesome/free-solid-svg-icons';
import { Location } from '@angular/common';

@Component({
    selector: 'admin-orders',
    templateUrl: './admin-orders.component.html',
    styleUrls: ['./admin-orders.component.scss']
})
export class AdminOrdersComponent implements OnInit, OnDestroy {

    public th: IThLabel[] = [];
    public order: IOrder;
    public orders: IOrder[] = [];

    private isArrowUp: boolean = true;
    public isOpen: boolean = false;
    public faArrow: IconDefinition = faArrowUp;
    private destroyed$: Subject<boolean> = new Subject();

    constructor(private service: DataService, private location: Location) { }

    public thMaker(): void {
        const labels = ['Customers', 'Date', 'Track Number', ''];
        const sortColPath = ['userInfo.userName', 'userInfo.timeStamp.seconds', 'id', ''];

        this.th = labels.map((item, i) => {
            return {
                label: item,
                sortPath: sortColPath[i],
                isVisible: i === 0 ? true : false
            }
        });
    }

    public getOrders(): void {
        this.service.getAll('ordersPlaced')
            .pipe(takeUntil(this.destroyed$))
            .subscribe((response: any) => {
                this.orders = response;
                this.onSort();
            });
    }

    public onSort(currentCol?: IThLabel): void {
        if (currentCol) {
            this.th.forEach(element => element.isVisible = false);
            currentCol.isVisible = true;
        };

        this.isArrowUp = !this.isArrowUp;

        const sortColPath = currentCol ? currentCol.sortPath : 'userInfo.userName';
        const sortColOrder: OrderByDirection = this.isArrowUp ? "desc" : "asc";
        this.faArrow = this.isArrowUp ? faArrowDown : faArrowUp;

        const sorted: IOrder[] = _.orderBy(this.orders, sortColPath, sortColOrder);
        this.orders = sorted;
    }

    public getOrderDetail(id: string): void {
        this.service.getItem('ordersPlaced', id)
            .subscribe((response: any) => {
                this.order = response;
                this.isOpen = true;
            });
    }

    public closeModal(e): void {
        const current: HTMLElement = e.target;
        const insideArea: boolean = current.classList.contains('card-body');
        if (!insideArea) {
            this.isOpen = false;
        }
    }

    public handleClick(isClicked: boolean): void {
        if (isClicked) {
            this.location.back();
        }
    }

    public ngOnInit(): void {
        this.thMaker();
        this.getOrders();
    }

    public ngOnDestroy(): void {
        this.destroyed$.next(true);
        this.destroyed$.complete();
    }
}
