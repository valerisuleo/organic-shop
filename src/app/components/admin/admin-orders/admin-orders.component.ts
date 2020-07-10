import * as _ from 'lodash';
import { Component, OnInit } from '@angular/core';
import { DataService } from '../../../services/data.service';
import { IOrder } from '../interfaces';
import { OrderByDirection } from '@firebase/firestore-types';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';

@Component({
    selector: 'admin-orders',
    templateUrl: './admin-orders.component.html',
    styleUrls: ['./admin-orders.component.scss']
})
export class AdminOrdersComponent implements OnInit {

    public orders: IOrder[] = [];
    private isUp: boolean = true;
    private destroyed$: Subject<boolean> = new Subject();

    constructor(private service: DataService) { }

    public getOrders(): void {
        const collection = 'ordersPlaced';
        this.service.getAll(collection)
            .pipe(takeUntil(this.destroyed$))
            .subscribe((response: any) => {
                this.orders = response;
                this.onSort();
            });
    }

    public onSort(path?: string): void {
        this.isUp = !this.isUp;
        let sortColPath = path ? path : 'userInfo.userName';
        let sortOrder: OrderByDirection = this.isUp ? "desc" : "asc";
        const sorted: IOrder[] = _.orderBy(this.orders, sortColPath, sortOrder);
        this.orders = sorted;
    }

    public ngOnInit(): void {
        this.getOrders();
    }

    public ngOnDestroy(): void {
        this.destroyed$.next(true);
        this.destroyed$.complete();
    }
}
